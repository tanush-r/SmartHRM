import os
import logging
import pymysql
from fastapi import FastAPI, HTTPException, Query
from typing import Literal
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MySQL connection details from environment variables
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB")

# Database connection settings (using PyMySQL)
DB_CONFIG = {
    "host": MYSQL_HOST,
    "user": MYSQL_USER,
    "password": MYSQL_PASSWORD,
    "database": MYSQL_DB,
    "cursorclass": pymysql.cursors.DictCursor  
}

# Define Pydantic models
class DashboardMetrics(BaseModel):
    total_clients: int
    total_requirements: int
    total_resumes: int
    

class PositionMetrics(BaseModel):
    total_open_positions: int
    total_closed_positions: int
    on_hold: int

# Helper function to connect to the database using PyMySQL
def get_db_connection():
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except pymysql.MySQLError as err:
        logger.error(f"Error connecting to MySQL: {err}")
        raise HTTPException(status_code=500, detail="Database connection failed.")

# Helper function to calculate the start date based on period
def get_start_date(period: Literal['today', 'this week', 'this month', 'all']) -> datetime:
    today = datetime.now()
    if period == 'today':
        return today.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'this week':
        start_of_week = today - timedelta(days=today.weekday())  # Monday as start of the week
        return start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'this month':
        return today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == 'all':
        # Return a date far in the past (e.g., 100 years ago) to include all available data
        return today.replace(year=today.year - 100, month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:
        raise ValueError("Invalid period specified")

# Master metrics endpoint for dashboard data
@app.get("/metrics/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    period: Literal['today', 'this week', 'this month', 'all'] = Query('all')  # Only period filter now
):
    start_date = get_start_date(period)
    metrics = {
        "total_clients": 0,
        "total_requirements": 0,
        "total_resumes": 0
        
    }
    
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Clients count
            query = """
                SELECT COUNT(*) AS total_clients
                FROM clients
                WHERE created_at >= %s
            """
            cursor.execute(query, (start_date,))
            client_data = cursor.fetchone()
            metrics["total_clients"] = client_data["total_clients"]
        
            # Requirements count
            query = """
                SELECT COUNT(*) AS count FROM requirements
                WHERE created_at >= %s
            """
            cursor.execute(query, (start_date,))
            metrics["total_requirements"] = cursor.fetchone()["count"]

            # Resumes count with join to job_descriptions and clients
            query = """
                SELECT COUNT(*) AS count
                FROM resumes
                WHERE resumes.created_at >= %s
            """
            cursor.execute(query, (start_date,))
            metrics["total_resumes"] = cursor.fetchone()["count"]

    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

    return metrics

# Positions status metrics endpoint (Open/Closed/On Hold)

# Status Metrics endpoint (no filtering by `job_descriptions`)
@app.get("/metrics/positions", response_model=PositionMetrics)
async def get_position_metrics(
    period: Literal['today', 'this week', 'this month', 'all'] = Query('all')
):
    start_date = get_start_date(period)
    status_metrics = {
        "total_open_positions": 0,
        "total_closed_positions": 0,
        "on_hold": 0
    }

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query to count the number of positions that are not "Onboarded" (open positions)
            query = """
                SELECT COUNT(*) AS count
                FROM status s
                LEFT JOIN resumes r ON s.st_id = r.st_id
                WHERE s.st_name != 'Onboarded' AND r.created_at >= %s
            """
            cursor.execute(query, (start_date,))
            status_metrics["total_open_positions"] = cursor.fetchone()["count"]
            
            # Query to count the number of positions that are "Onboarded" (closed positions)
            query = """
                SELECT COUNT(*) AS count
                FROM status s
                LEFT JOIN resumes r ON s.st_id = r.st_id
                WHERE s.st_name = 'Onboarded' AND r.created_at >= %s
            """
            cursor.execute(query, (start_date,))
            status_metrics["total_closed_positions"] = cursor.fetchone()["count"]

            # Query to count the number of positions that are "On Hold"
            query = """
                SELECT COUNT(*) AS count
                FROM status s
                LEFT JOIN resumes r ON s.st_id = r.st_id
                WHERE s.st_name = 'On Hold' AND r.created_at >= %s
            """
            cursor.execute(query, (start_date,))
            status_metrics["on_hold"] = cursor.fetchone()["count"]

    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        connection.close()

    return status_metrics