# Functional Requirements Document(FRD)

All data mentioned in this document is not finalized and subject to 
review.

## **Introduction**

### Project Overview

HR Hub is a cloud-based Generative AI powered HR CRM solution designed
to streamline the recruitment process by automating the generation of
interview questions based on a candidate\'s resume. Our AI powered HR
engine will be able to give end-to end assistance to the users,
providing well-needed assistance in parsing multiple resumes for all
kinds of requirements. HR hub can be used to save tons of time by doing
the menial repetitive tasks, while the HR team can focus on the overview
process and supervision of the system. HR Hub can understand the context
of the given resume, and smartly generate interview questions based on
tailor-specific requirements and complex technical detail.

### Scope

HR Hub is meant to provide an end-to-end solution for all needs that the
HR team may have. In specific, the scope of HR Hub will be to

-   Generate a set of screening questions with answers for the following

    -   Roles & Responsibilities from the job description

    -   Technical Details from the job description

    -   Projects and Experience from the resume

-   Rank all candidates based on a given requirement, which either considers the candidates associated with the requirement, or all the available candidates in the backlog. 

-   Track all candidates by their resumes and all job descriptions in
    the HR Hub repository

-   Use HR specified instructions (such as "Ask more questions based on
    leadership tasks" to follow for its tasks

-   Take into consideration an optional previous interview transcript
    based on which the HR engine should be able to define the tone and
    considerations for its tasks


### Target Users

The target users for HR Hub are classified based on the various roles
and duties of the HR team:

### 1. Client Co-ordinator

**Requirements:**

-   Create new job positions and new clients

-   Upload Job Description document and associate the doc with the job
    position

-   Upload resumes and associate them with a particular job position

-   Generate report based on clients and positions.

### 2. HR Lead

**Requirements:**

-   Should be able to rank resumes either based on association to job
    position or all resumes and retrieve the top matching resumes.

-   Generate a set of technical screening questions with sample answers
    based on job description or resume

-   View keywords from JD matching with resume and missing from resume

-   Analyze the gaps in work experience/education

-   Select the particular candidate for shortlisting

-   Generate report based on shortlisting

### 3. HR Recruiter

**Requirements:**

-   Should be able to view status of any candidate based on company name
    or company requirement

-   Should be able to change the status of any candidate manually.

-   Should be able to schedule an interview on a particular date

-   Query any candidate from all the candidates.

-   Generate report based on candidate tracking

### 4. Admin

**Requirements:**

-   View a dashboard containing all the information of various
    components including pending positions, closed positions, clients,
    etc

-   Generate reports for all components.

## **System Overview**

### High-Level Description

HR Hub will consist of these main components

-   **Repositories:** User can store all required documents and query
    them

    -   **Resume Repository:** Stores a collection of uploaded resumes.

    -   **Job Description Repository:** Stores a collection of uploaded
        job descriptions.

    -   **Generated QA Repository:** Stores generated questions and
        answer.

-   **HR Engine:** An AI component that processes uploaded documents,
    extracts relevant information, and generates tailored interview
    questions and answers based on user-provided instructions and
    context.

-   **Resume Extractor**: A script which will automatically pull resumes
    from the HR email/cloud storage and upload it to the resume
    repository.

- **Resume Ranker**:  A ranking system which returns the top matched resumes from the job description based on the features from Resume Extractor

-   **Smart Screener:** The user interface that facilitates interaction
    with the HR Engine. Users can input instructions, select documents
    from the repositories, and view the generated output.

### Use Case

-   A recruiter uploads a job description for a Full Stack Developer and
    a candidate\'s resume to the repository.

-   They then use the Smart Screener to select the candidate and job
    description, provide instruction to focus more on back-end questions
    and experience with cloud technologies.

-   They upload a previous interview transcript, in which other
    candidate failed to answer a particular question causing him to get
    rejected.

-   The HR engine generates technical questions considering all the
    context and information. It also provides sample answers for
    reference to the user.

-   Recruiter saves the questions to repository and deletes the saved JD
    if the candidate is placed successfully.

## **Functional Requirements**

### Detailed Specifications

-   **HR Hub Repository:** An extensive repository where users can
    upload resumes, job description documents and keep track of all
    contents. Users should be able to search resumes or JDs based on
    keywords/tags. Questions and answers generated should also be able
    to be saved and viewed. Documents can be deleted as required by
    user. This will consist of

    -   Resume Repository

    -   Job Description Repository

    -   Generated QA repository

-   **HR Engine:** The main AI component of the system which should be
    able to take in the multiple inputs from user, pull relevant data
    from the repository and generate questions with answers based on the
    requirements, with a complete understanding of the context provided,
    instructions and general tone from the transcripts optionally.

-   **Resume Extractor:** A continuously running system which has access
    to the email/cloud storage of the user. This system is capable of
    automatically pulling resume document from the preferred storage and
    populate the HR repository as needed. It is also able to associate
    the resume to the given JD requirement from the context
    provided(through email title or cloud folder name).

-   **Smart Screener:** The input point for the user to interact with
    the HR Engine, where user can provide all necessary instructions and
    context, along with choosing resumes and JD from the repository. It
    should be able to extract data from the repository and provide the
    inputs to the HR engine, and display a well-structured output.

### User Interface (UI) Requirements

-   **Simplicity**: Design an intuitive, user friendly interface where
    all components of the project are presented in simple UI design,
    where it is easy to understand for non-technical members.

-   **Abstraction**: Abstract the AI components and HR engine in such a
    way that user simply obtains solution for their needs without
    knowing/showing the technical components.

-   **Consistency**: Use clear and consistent labeling with helpful tool
    tips and context-sensitive information and clear straightforward
    user interface.

### Non-Functional Requirements

-   **Performance:** All AI functionality, including dependency on cloud
    based AI models should be responsive and fast with the results.

-   **Flexibility of Hosting:** Ensure that all cloud requirements of
    the project are vendor-independent (not fully dependent on only
    AWS/Azure/Google Cloud) to allow flexibility based on user's hosting
    preferences.

-   **Security and Privacy:** Implement robust security measures to
    protect user data, including ensuring privacy of candidate and
    company data, by using AI models which do not retain data in any
    manner.

## **Data Requirements**

### Data Entities

-   **Candidate Resume Document:** The unstructured data of candidate
    details, including name, contact info, experience. etc. This will be
    in pdf or word document formats.(.pdf, .docx)

-   **Extracted Formatted Resume**: The well-formatted details of
    candidate extracted from resume document.

-   **Job Description Document:** The unstructured data of job
    description consisting of roles and responsibilities,
    qualifications, minimum experience, etc, as well as company name and
    job position. This will be in pdf, word, or excel document
    formats.(.pdf, .docx, .xlsx)

-   **Extracted Formatted JD**: The well-formatted details of JD
    extracted from JD document.

-   **Generated Question Answer Pair:** The saved question answers from
    the Smart Screener.

-   **Audio Transcript:** An audio file transcript of previous input

-   **Interview Recording:** Video file of recording of completed
    interview

### Data Flow

-   User uploads resume and JD documents to their respective HR
    repositories, which gets saved.

-   User enters the Smart Screener, where they choose the saved resume
    and JD.

-   User optionally uploads a previous transcript, which is also
    analyzed.

-   User provides specific instructions to be followed when generating
    the questions.

-   User receives the generated questions and answers, which they can
    save and view later

## **External Interfaces**

### System Interfaces

-   Integration with user's preferred cloud storage for potentially
    storing project relevant documents

-   Interface with user's email provider for pulling document from
    user's emails to automatically update the repository

### User Interfaces

-   External user (who could be a customer or client) will interact with
    our application through the decided method with authentication to
    verify credentials.

-   External user can view chosen candidates, whose details can be
    modified as required(potentially to remove contact details and
    personal info)

-   External user can then accept or reject the candidates.

## **Assumptions and Dependencies**

### Assumptions

-   Cloud-based AI models will be allowed to use confidential data, as
    the cloud providers can typically guarantee data anonymity and avoid
    data retention for training or other purposes

-   Company should be willing to provide multiple resumes and job
    description documents (typically as much as possible) to potentially
    train AI models.

-   Company should provide necessary funding to manage the deployments
    and cloud services.

### Dependencies

-   Multiple resumes and JDs need to be provided for training and
    testing.

-   HR team and other potential users should be ready for user
    interview, user acceptance and other requirements of project.

## Glossary

-   **HR CRM**: Human Resource Customer Relationship Management

-   **JD**: Job Description

-   **AWS**: Amazon Web Services

-   **QA**: Question Answer
