import { Injectable } from '@angular/core';

// Define interfaces for Client, Position, and Resume
export interface Client {
  cl_id: string; // Client ID
  cl_name: string; // Client Name
}

export interface Position {
  jd_id: string; // Job Description ID
  cl_id: string; // Client ID (changed from client_id to cl_id)
  filename: string; // Filename of the position
  s3_link: string; // S3 link to the position details
  timestamp: string; // Timestamp of the position creation
}

export interface Resume {
  resume_id: string; // Resume ID
  jd_id: string; // Job Description ID
  created_at: string; // Creation timestamp
  s3_link: string; // S3 link to the resume
  filename: string; // Filename of the resume
  status: string; // Status of the resume
  eligible: boolean; // Make this mandatory
  notEligible: boolean; // Make this mandatory
  onboarded: boolean; // Make this mandatory
}


@Injectable({
  providedIn: 'root'
})
export class ResumeStateService {
  private selectedClientId: string = ''; // Store selected Client ID
  private selectedPosition: string = ''; // Store selected Position ID
  private resumes: Resume[] = []; // Store list of resumes
  private positionS3Link: string = ''; // Store Position S3 Link
  private jdId: string = ''; // Store JD ID

  // Set the selected client ID
  setSelectedClientId(clientId: string): void {
    this.selectedClientId = clientId;
  }

  // Get the selected client ID
  getSelectedClientId(): string {
    return this.selectedClientId;
  }

  // Set the selected position ID
  setSelectedPosition(position: string): void {
    this.selectedPosition = position;
  }

  // Get the selected position ID
  getSelectedPosition(): string {
    return this.selectedPosition;
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

  // Set the JD ID
  setJDId(jdId: string): void {
    this.jdId = jdId;
  }

  // Get the JD ID
  getJDId(): string {
    return this.jdId;
  }

  // Clear the stored state
  clearState(): void {
    this.selectedClientId = '';
    this.selectedPosition = '';
    this.resumes = [];
    this.positionS3Link = ''; // Clear position S3 link
    this.jdId = ''; // Clear JD ID
  }
}
