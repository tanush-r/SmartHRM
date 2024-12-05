import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define interfaces for Client, Position, Resume, and Status
export interface Client {
  cl_id: string; // Client ID
  cl_name: string; // Client Name
}

export interface Position {
  jd_id: string; // Job Description ID
  cl_id: string; // Client ID
  filename: string; // Filename of the position
  s3_link: string; // S3 link to the position details
  created_at: string; // Creation timestamp
}

export interface Resume {
  resume_id: string; // Resume ID
  jd_id: string; // Job Description ID
  created_at: string; // Creation timestamp
  s3_link: string; // S3 link to the resume
  filename: string; // Filename of the resume
  status: string; // Status of the resume
  st_id: string | null; // Status ID
  st_name: string; // Status Name
}

export interface Status {
  st_id: string; // Status ID
  st_name: string; // Status Name
}

@Injectable({
  providedIn: 'root'
})
export class ResumeStateService {
  private selectedClientId: string = ''; // Store selected Client ID
  private selectedPositionId: string = ''; // Store selected Position ID
  private selectedStatusId: string = ''; // Store selected Status ID
  private resumes: Resume[] = []; // Store list of resumes
  private positionS3Link: string = ''; // Store Position S3 Link
  private jdId: string = ''; // Store Job Description ID

  // Create a BehaviorSubject to hold the resumes
  private resumesSubject = new BehaviorSubject<Resume[]>(this.resumes);
  resumes$: Observable<Resume[]> = this.resumesSubject.asObservable(); // Expose the observable

  // Set the selected client ID
  setSelectedClientId(clientId: string): void {
    this.selectedClientId = clientId;
  }

  // Get the selected client ID
  getSelectedClientId(): string {
    return this.selectedClientId;
  }

  // Set the selected position ID
  setSelectedPosition(positionId: string): void {
    this.selectedPositionId = positionId;
  }

  // Get the selected position ID
  getSelectedPosition(): string {
    return this.selectedPositionId;
  }

  // Set the selected status ID
  setSelectedStatusId(statusId: string): void {
    this.selectedStatusId = statusId;
  }

  // Get the selected status ID
  getSelectedStatusId(): string {
    return this.selectedStatusId;
  }

  // Set the list of resumes and emit the new value
  setResumes(resumes: Resume[]): void {
    this.resumes = resumes;
    this.resumesSubject.next(this.resumes); // Emit the new resumes
  }

  // Get the list of resumes
  getResumes(): Resume[] {
    return this.resumes;
  }

  // Update a specific resume by ID
  updateResume(resumeId: string, updatedResume: Partial<Resume>): void {
    this.resumes = this.resumes.map(resume => 
      resume.resume_id === resumeId ? { ...resume, ...updatedResume } : resume
    );
    this.resumesSubject.next(this.resumes); // Emit the updated resumes
  }

  // Set the position S3 link
  setPositionS3Link(link: string): void {
    this.positionS3Link = link;
  }

  // Get the position S3 link
  getPositionS3Link(): string {
    return this.positionS3Link;
  }

  // Set the Job Description ID
  setJDId(jdId: string): void {
    this.jdId = jdId;
  }

  // Get the Job Description ID
  getJDId(): string {
    return this.jdId;
  }

  // Clear the stored state
  clearState(): void {
    this.selectedClientId = '';
    this.selectedPositionId = '';
    this.selectedStatusId = ''; // Clear selected Status ID
    this.resumes = [];
    this.positionS3Link = ''; // Clear position S3 link
    this.jdId = ''; // Clear Job Description ID
    this.resumesSubject.next(this.resumes); // Emit the cleared resumes
  }
}
