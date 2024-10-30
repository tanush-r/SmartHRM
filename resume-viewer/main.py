from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from gptea import QuestionAnswerChain
import pymupdf
from docx import Document
from io import BytesIO
import mysql.connector
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import boto3
import tempfile

# Load environment variables from a .env file
load_dotenv()
app = FastAPI(root_path="/api/viewer")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION_NAME')
AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')

s3 = boto3.client('s3', 
                  aws_access_key_id=AWS_ACCESS_KEY, 
                  aws_secret_access_key=AWS_SECRET_KEY, 
                  region_name=AWS_REGION)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DB'),
        port=os.getenv('MYSQL_PORT', 3306)  # Default to 3306 if not set
    )

# Pydantic models
class Client(BaseModel):
    client_id: str
    client_name: str

class JobDescription(BaseModel):
    jd_id: str
    client_id: str
    filename: str
    s3_link: str
    timestamp: Optional[str] = None

class Resume(BaseModel):
    resume_id: str
    jd_id: str
    filename: str
    s3_link: str
    timestamp: Optional[str] = None
    status: Optional[str] = None

# Convert binary to hex string
def binary_to_hex(data: bytes) -> str:
    return data.hex()

# Convert datetime to string
def datetime_to_str(dt: datetime) -> str:
    return dt.isoformat()

# Get clients
@app.get("/clients", response_model=List[Client])
def get_clients():
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT client_id, client_name FROM clients")
        clients = cursor.fetchall()
        for client in clients:
            client['client_id'] = binary_to_hex(client['client_id'])
        return clients
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

# Get positions by client ID
@app.get("/positions", response_model=List[JobDescription])
def get_positions(client_id: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT jd_id, client_id, filename, s3_link, timestamp FROM job_descriptions WHERE client_id = UNHEX(%s)", (client_id,))
        job_descriptions = cursor.fetchall()
        for job in job_descriptions:
            job['client_id'] = binary_to_hex(job['client_id'])
            if job['timestamp']:
                job['timestamp'] = datetime_to_str(job['timestamp'])
        return job_descriptions
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

# Get resumes by job description ID
@app.get("/resumes", response_model=List[Resume])
def get_resumes(jd_id: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT resume_id, jd_id, filename, s3_link, timestamp, status FROM resumes WHERE jd_id = %s ORDER BY timestamp DESC", (jd_id,))
        resumes = cursor.fetchall()
        for resume in resumes:
            if resume['timestamp']:
                resume['timestamp'] = datetime_to_str(resume['timestamp'])
        return resumes
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

# Download resume by resume ID
@app.get("/resumes/download")
def download_resume(resume_id: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT filename FROM resumes WHERE resume_id = %s", (resume_id,))
        resumes = cursor.fetchone()
        if resumes is None:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        filename = resumes['filename']
        
        # Redirect to the S3 link for downloading
        object_name = f'resumes/{filename}'

        download_path = os.path.join(tempfile.gettempdir(), filename)
        s3.download_file(AWS_S3_BUCKET_NAME, object_name, download_path)        
        return FileResponse(download_path, media_type='application/octet-stream', filename=filename)
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

# Download resume by resume ID
@app.get("/positions/download")
def download_resume(jd_id: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT filename FROM job_descriptions WHERE jd_id = %s", (jd_id,))
        jds = cursor.fetchone()
        if jds is None:
            raise HTTPException(status_code=404, detail="JD not found")
        
        filename = jds['filename']
        
        # Redirect to the S3 link for downloading
        object_name = f'JD/{filename}'

        download_path = os.path.join(tempfile.gettempdir(), filename)
        s3.download_file(AWS_S3_BUCKET_NAME, object_name, download_path)          
        return FileResponse(download_path, media_type='application/octet-stream', filename=filename)
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

allowed_files = ["pdf", "doc", "docx"]

def extract_filetype(filename: str):
    return filename.rsplit('.', 1)[1].lower()

def read_pdf(content):
    doc = pymupdf.Document(stream=content)

    # Extract the text from all pages
    text_content = ""
    for page in doc:
        text_content += page.get_text()

    return text_content

def read_docx(content):
    doc = Document(BytesIO(content))

    # Extract text from the document
    return "\n".join([para.text for para in doc.paragraphs])


@app.get("/qa_gen/resume")
async def generate_questions(count: int, resume_id: str):

    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT filename FROM resumes WHERE resume_id = %s", (resume_id,))
        resumes = cursor.fetchone()
        if resumes is None:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        filename = resumes['filename']
        
        # Redirect to the S3 link for downloading
        object_name = f'resumes/{filename}'

        download_path = os.path.join(tempfile.gettempdir(), filename)
        s3.download_file(AWS_S3_BUCKET_NAME, object_name, download_path)  
    except mysql.connector.Error as err:
        
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

    if extract_filetype(filename) == "pdf":
        pdf_doc = pymupdf.open(download_path)

        # Extract the text from all pages
        doc = ""
        for page in pdf_doc:
            doc += page.get_text()
    elif extract_filetype(filename) == "pdf":
        docx_doc = Document(download_path)

        # Extract text from the document
        doc = "\n".join([para.text for para in docx_doc.paragraphs])
    else:
        raise HTTPException(status_code=400, detail="File type not allowed. Only PDF and Word documents are accepted.")
    
    chain = QuestionAnswerChain(doc=doc, is_resume=True)
    return chain.invoke(count)


@app.get("/qa_gen/jd")
async def generate_questions(count: int, jd_id: str):

    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT filename FROM job_descriptions WHERE jd_id = %s", (jd_id,))
        jds = cursor.fetchone()
        if jds is None:
            raise HTTPException(status_code=404, detail="JD not found")
        
        filename = jds['filename']
        
        # Redirect to the S3 link for downloading
        object_name = f'JD/{filename}'

        download_path = os.path.join(tempfile.gettempdir(), filename)
        s3.download_file(AWS_S3_BUCKET_NAME, object_name, download_path)  
    except mysql.connector.Error as err:
        
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

    if extract_filetype(filename) == "pdf":
        pdf_doc = pymupdf.open(download_path)

        # Extract the text from all pages
        doc = ""
        for page in pdf_doc:
            doc += page.get_text()
            
    elif extract_filetype(filename) == "pdf":
        docx_doc = Document(download_path)

        # Extract text from the document
        doc = "\n".join([para.text for para in docx_doc.paragraphs])
    else:
        raise HTTPException(status_code=400, detail="File type not allowed. Only PDF and Word documents are accepted.")
    
    chain = QuestionAnswerChain(doc=doc, is_resume=False)
    return chain.invoke(count)

# Update the resume status
@app.post("/resumes/status/{resume_id}")
def update_resume_status(resume_id: str, status: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("UPDATE resumes SET status = %s WHERE resume_id = %s", (status, resume_id))
        db.commit()
        return {"message": "Resume status updated successfully"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()

# Get resumes with a specific status
@app.get("/resumes/status/{resume_id}", response_model=Resume)
def get_resume_status(resume_id: str):
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT resume_id, jd_id, filename, s3_link, timestamp, status FROM resumes WHERE resume_id = %s", (resume_id,))
        resume = cursor.fetchone()
        if resume is None:
            raise HTTPException(status_code=404, detail="Resume not found")
        # Convert timestamp to string if it exists
        if resume['timestamp']:
            resume['timestamp'] = resume['timestamp'].isoformat()
        return resume
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
            db.close()