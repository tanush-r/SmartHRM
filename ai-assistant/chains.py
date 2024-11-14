import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import mysql.connector
import os
import sqlparse
from dotenv import load_dotenv
from typing import Union
import json
import sqlglot


class GPUNotFoundException(Exception):
    """Throw exception if NVIDIA GPU is not found or CUDA not installed"""
    
    def __init__(self):
        message = "NVIDIA GPU not found or CUDA not installed. Terminating..."
        super().__init__(message)
    
class SQLChain:

    def __init__(self):

        print("Initializing LLM & DB..")

        load_dotenv()

        MYSQL_HOST = os.getenv("MYSQL_HOST")
        MYSQL_USER = os.getenv("MYSQL_USER")
        MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
        MYSQL_DB = os.getenv("MYSQL_DB")

        try:
            self.conn = mysql.connector.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DB
            )
            print(self.conn)
        except mysql.connector.Error as err:
            raise(err)
        
        if not torch.cuda.is_available():
            raise GPUNotFoundException()

        # if os.path.exists("/sqlcoder"):
        #     self.tokenizer = 
        # else:
        model_name = "defog/sqlcoder-7b-2"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=r"sqlcoder\tokenizer")
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            trust_remote_code=True,
            load_in_4bit=True,
            device_map="auto",
            use_cache=True,
            cache_dir=r"sqlcoder\model"
        )
            # self.tokenizer.save_pretrained("/sqlcoder/tokenizer")
            # self.model.save_pretrained("/sqlcoder/model")

        self.prompt = """### Task
        Generate a MySQL query to answer [QUESTION]{question}[/QUESTION]

        ### Instructions
        - This schema runs on mysql server and not postgres server
        - The database schema provided is in mysql syntax so make sure you generate sql in mysql format
        - Instead of ILIKE in the query use "LIKE" in the query
        -  Instead of 'true or false ' use 1 or 0 in the  query
        - The tables are for a HR hiring system, where they have many clients, each client with various positions (job description document for each) 
        - Each job description has multiple candidates (resume for each)
        - User may refer resumes table as candidates, job_description table as requirements or positions.
        - If you cannot answer the question with the available database schema, return 'I do not know'

        ### Database Schema
        This query will run on a database whose schema is represented in this string:
        CREATE TABLE clients (
            client_id BINARY(16) NOT NULL,
            client_name VARCHAR(255) NOT NULL,
            PRIMARY KEY (client_id)
        );
        CREATE TABLE job_descriptions (
            jd_id VARCHAR(255) NOT NULL,
            client_id BINARY(16) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            s3_link VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (jd_id),
            FOREIGN KEY (client_id) REFERENCES clients(client_id)
        );
        CREATE TABLE resumes (
            resume_id VARCHAR(32) PRIMARY KEY,
            jd_id VARCHAR(50),
            filename VARCHAR(255),
            s3_link TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50)
        );

        -- resumes.jd_id can be joined with job_descriptions.jd_id
        -- job_descriptions.client_id can be joined with clients.client_id 


        ### Answer
        Given the database schema, here is the MySQL query that answers [QUESTION]{question}[/QUESTION]
        [SQL]
        """

        print("Finished initializing LLM & DB")


    def generate_query(self, question):

        updated_prompt = self.prompt.format(question=question)
        inputs = self.tokenizer(updated_prompt, return_tensors="pt").to("cuda")
        generated_ids = self.model.generate(
            **inputs,
            num_return_sequences=1,
            eos_token_id=self.tokenizer.eos_token_id,
            pad_token_id=self.tokenizer.eos_token_id,
            max_new_tokens=400,
            do_sample=False,
            num_beams=1,
        )
        outputs = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)

        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        # empty cache so that you do generate more results w/o memory crashing

        postgres = sqlparse.format(outputs[0].split("[SQL]")[-1], reindent=True)

        if "i do not know" in postgres.lower():
            return {"Failed": "Im sorry, I do not understand your query."}

        mysql_query = self.convert_pgsql_to_mysql(postgres)

        return mysql_query
    

    def convert_pgsql_to_mysql(self, sql):

        print(f"PostGreSQL Query :{sql}\n")

        transpiled_query = sqlglot.transpile(sql, read="postgres", write="mysql")[0]

        print(f"MySQL Query :{transpiled_query}\n\n")

        return transpiled_query

    
    def invoke(self, query: str) -> dict:

        query = self.generate_query(query)

        try:
            cursor = self.conn.cursor(dictionary=True)
            cursor.execute(query)
            response = cursor.fetchall()
            return response
        except Exception as e:
            print(e)
            return {"Error" : str(e)}
        

if __name__ == "__main__":

    chain = SQLChain()
    print("Initialized LLM")
    while True:
        # question = "How many candidates does requirement id #netjdf001 have"
        query = input("Enter natural language question: ")
        print(chain.invoke(query))