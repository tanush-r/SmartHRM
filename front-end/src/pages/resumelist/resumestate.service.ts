import { Injectable } from '@angular/core';

// Define interfaces for Client, Position, and Resume
export interface Client {
  client_id: string;
  client_name: string;
}

export interface Position {
  jd_id: string;
  client_id: string;
  filename: string;
  s3_link: string;
  timestamp: string;
}

export interface Resume {
  resume_id: string;
  jd_id: string;
  filename: string;
  s3_link: string;
  timestamp: string;
  status: string;
  eligible: boolean;
  notEligible: boolean;
  onboarded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeStateService {
  private selectedClientId: string = '';
  private selectedPosition: string = '';
  private resumes: Resume[] = [];
  private positionS3Link: string = ''; // Store Position S3 Link
  private jdId: string = ''; // New: Store JD ID

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
