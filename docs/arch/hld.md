# High Level Design Documentation

## Diagram
![High-Level Design](hld.png)

## Overview
This document outlines a High Level Design (HLD) that also serves as a Service Level Design for a secure, microservices-based architecture.


## System Components

### Storage Systems
- **Amazon S3**: Cloud object storage service
- **RDS (MySQL)**: Relational database system

### Frontend Layer
- **User Interface Service**
  - Built with Angular
  - Single unified interface
  - Interfaces with multiple backend services

### Authentication
- **OAuth Service**
  - Built with Python
  - Handles username/password authentication
  - Issues access tokens (JWT)
  - Manages user authentication flow

### Core Services

#### Upload Services
- **Resume Upload Service**
  - Built with FastAPI Python
  - Handles resume document processing
  - Interfaces with S3 and database services

- **JD Upload Service**
  - Built with FastAPI Python
  - Manages job description document uploads
  - Communicates with storage services

#### CRUD Services
1. **S3 Service**
   - Built with FastAPI Python
   - Manages object storage operations
   - Direct integration with Amazon S3

2. **Resume RDBMS Service**
   - Built with FastAPI Python
   - Handles resume-related database operations

3. **Client & Position RDBMS Service**
   - Built with FastAPI Python
   - Manages client and position data in database

4. **Client and Contact Person Details Service**
   - Built with FastAPI Python
   - Handles client contact information storage and retrieval

5. **Requirements Service**
   - Built with FastAPI Python
   - Manages job requirement specifications

6. **Candidate Service**
   - Built with FastAPI Python
   - Handles candidate information and processing

### Supporting Services
- **Viewer Updater & QA Gen Service**
  - Built with Python
  - Handles document viewing and quality assurance
  - Interfaces with database services

- **Intermediate Service**
  - Built with FastAPI Python
  - Acts as an orchestration layer
  - Routes requests to appropriate CRUD services

## Service Interactions

### Authentication Flow
1. User provides username/password to OAuth service
2. OAuth service returns access token
3. UI service uses token for subsequent service requests

### Data Flow
1. UI service communicates with upload services for document processing
2. Upload services interact with storage services (S3 and RDS)
3. Intermediate service orchestrates CRUD operations across multiple services
4. All CRUD services maintain consistent communication with RDS

## Technical Stack
- **Frontend**: Angular
- **Backend Services**: FastAPI Python
- **Storage**: 
  - Amazon S3 for document storage
  - RDS MySQL for structured data
- **Authentication**: OAuth with JWT
