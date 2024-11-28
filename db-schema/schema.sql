CREATE DATABASE MVP2;
USE MVP2;


CREATE TABLE clients (
    cl_id VARCHAR(100) NOT NULL PRIMARY KEY,
    cl_name VARCHAR(255) NOT NULL,
    cl_email VARCHAR(100),
    cl_phno VARCHAR(20),
    cl_addr TEXT,
    cl_map_url TEXT,
    cl_type VARCHAR(50),
    cl_notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE job_descriptions (
    jd_id VARCHAR(100) NOT NULL PRIMARY KEY,
    cl_id VARCHAR(100),
    filename VARCHAR(255) NOT NULL,
    s3_link VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cl_id) REFERENCES clients(cl_id) ON DELETE SET NULL
);

CREATE TABLE contacts (
    co_id VARCHAR(100) NOT NULL PRIMARY KEY,
    cl_id VARCHAR(100),
    co_name VARCHAR(255) NOT NULL,
    co_position_hr VARCHAR(100),
    co_email VARCHAR(100) NOT NULL UNIQUE,
    co_phno VARCHAR(20) NOT NULL UNIQUE,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cl_id) REFERENCES clients(cl_id) ON DELETE SET NULL
);

CREATE TABLE resumes (
    resume_id VARCHAR(100) NOT NULL PRIMARY KEY,
    jd_id VARCHAR(255),
    filename VARCHAR(255),
    s3_link TEXT,
    st_id VARCHAR(100),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (jd_id) REFERENCES job_descriptions(jd_id) ON DELETE SET NULL,
    FOREIGN KEY (st_id) REFERENCES status(st_id) ON DELETE SET NULL
);


CREATE TABLE requirements (
    rq_id VARCHAR(100) NOT NULL PRIMARY KEY,
    cl_id VARCHAR(100),
    rq_name VARCHAR(255) NOT NULL,
    rq_loc VARCHAR(255) NOT NULL,
    rq_map_url VARCHAR(255),
    rq_no_pos INT NOT NULL,
    rq_qual VARCHAR(255),
    rq_skills TEXT NOT NULL,
    rq_exp INT NOT NULL,
    rq_budget DECIMAL(10, 2),
    rq_work_mode VARCHAR(50),
    rq_start_date DATE,
    rq_no_of_days VARCHAR(100),
    rq_notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cl_id) REFERENCES clients(cl_id) ON DELETE SET NULL
);

CREATE TABLE candidates (
    cd_id VARCHAR(100) NOT NULL PRIMARY KEY,
    rq_id VARCHAR(100),
    cd_first_name VARCHAR(255) NOT NULL,
    cd_last_name VARCHAR(255),
    cd_email VARCHAR(100) NOT NULL UNIQUE,
    cd_phno VARCHAR(20) NOT NULL UNIQUE,
    cd_qual VARCHAR(255) NOT NULL,
    cd_skills VARCHAR(255),
    cd_total_exp INT NOT NULL,
    cd_related_exp INT,
    cd_loc VARCHAR(255) NOT NULL,
    cd_cur_ctc DECIMAL(10, 2) NOT NULL,
    cd_exp_ctc DECIMAL(10, 2) NOT NULL,
    cd_notice VARCHAR(50) NOT NULL,
    cd_work_mode VARCHAR(50) NOT NULL,
    cd_valid_passport TINYINT(1),
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rq_id) REFERENCES requirements(rq_id) ON DELETE SET NULL
);

CREATE TABLE status (
    st_id VARCHAR(100) NOT NULL PRIMARY KEY,
    st_name VARCHAR(255) NOT NULL
);