CREATE DATABASE HR;
use HR;
CREATE TABLE clients (
    client_id BINARY(16) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (client_id)
);
-- Create Job Descriptions Table
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
