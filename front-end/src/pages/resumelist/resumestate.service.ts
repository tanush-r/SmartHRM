import { Injectable } from '@angular/core';

// Define interfaces for Client, Position, and Resume
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
  st_id:string;
  st_name:string;
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
  private resumes: Resume[] = []; // Store list of resumes
  private positionS3Link: string = ''; // Store Position S3 Link
  private jdId: string = ''; // Store Job Description ID

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

  // Set the list of resumes
  setResumes(resumes: Resume[]): void {
    this.resumes = resumes;
  }

  // Get the list of resumes
  getResumes(): Resume[] {
    return this.resumes;
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
    this.resumes = [];
    this.positionS3Link = ''; // Clear position S3 link
    this.jdId = ''; // Clear Job Description ID
  }
}
