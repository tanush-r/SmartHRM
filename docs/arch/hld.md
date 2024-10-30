# High Level Design Documentation

## Diagram
![High-Level Design](hld.png)

## Overview
This document outlines the High Level Design (HLD) that can also serve as a Service Level Design for a multi-service architecture.

## System Components

### Storage Systems
- **Amazon S3**: Object storage service
- **RDS (MySQL)**: Relational database service

### Frontend Services
- **User Interface Service MVP-1**
  - Built with Angular
  - Primary user interface component
- **User Interface Service MVP-2**
  - Built with Angular
  - Secondary user interface component

### Email Integration
- **Gmail Server**: External email service
- **PubSub Service**
  - Hosted on GCP
  - Interfaces with Gmail server
- **Gmail IMAP Polling Windows Service**
  - Built with FastAPI Python
  - Handles email polling operations

### Core Services

#### Upload Services
- **Resume Upload Service**
  - Built with FastAPI Python
  - Handles resume file processing
- **JD Upload Service**
  - Built with FastAPI Python
  - Manages job description uploads

#### CRUD Services
1. **S3 Service**
   - Built with FastAPI Python
   - Manages S3 storage operations

2. **Resume RDBMS Service**
   - Built with FastAPI Python
   - Handles resume data in database

3. **Client & Position RDBMS Service**
   - Built with FastAPI Python
   - Manages client and position data

4. **Client and Contact Person Details Service**
   - Built with FastAPI Python
   - Handles client contact information

5. **Requirements Service**
   - Built with FastAPI Python
   - Manages requirement specifications

6. **Candidate Service**
   - Built with FastAPI Python
   - Handles candidate information

### Supporting Services
- **Viewer Updater & QA Gen Service**
  - Built with Python
  - Handles viewing and quality assurance
- **Intermediate Service**
  - Built with FastAPI Python
  - Acts as a middleware service
- **OAuth Service**
  - Built with Python
  - Handles authentication

## Service Interactions
1. The system shows bidirectional communication between UI services and various processing services
2. Clear data flow paths between storage systems (S3 and RDS) and processing services
3. Email integration through Gmail server and associated services
4. Centralized authentication through OAuth service
5. Multiple CRUD services interfacing with RDS storage

## Technical Stack
- **Frontend**: Angular
- **Backend**: FastAPI Python
- **Storage**: 
  - Amazon S3 for object storage
  - RDS MySQL for relational data
- **Cloud Services**: 
  - GCP (PubSub)
  - AWS (S3, RDS)

