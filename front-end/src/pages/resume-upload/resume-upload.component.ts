import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

// Define interfaces for the API response
interface Client {
  client_name: string;
}

interface PositionResponse {
  jd_filenames: string[];
}

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css'],
})
export class ResumeUploadComponent implements OnInit {
  clients: Client[] = [];
  positions: string[] = [];
  selectedClientName: string = '';
  selectedPosition: string = '';
  selectedResume: File | null = null;

  // Additional variables for upload status
  isUploading: boolean = false;
  uploadStatus: 'success' | 'error' | null = null;
  fileName: string = 'Upload Resumes (PDF)'; // Default text for the upload button

  // Reference to the hidden file input
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients(); // Load clients when the component initializes
  }

  // Load clients from the API
  loadClients(): void {
    this.http.get<Client[]>('/api/resume_upload/clients').subscribe(
      (data: Client[]) => {
        this.clients = data; // Store the clients in the component
      },
      (error) => {
        console.error('Error fetching clients:', error); // Log any errors
      }
    );
  }

  // Fetch positions based on selected client
  onClientChange(): void {
    if (this.selectedClientName) {
      this.http.get<PositionResponse>(`/api/resume_upload/positions/${this.selectedClientName}`).subscribe(
        (data: PositionResponse) => {
          this.positions = data.jd_filenames; // Store the positions for the selected client
        },
        (error) => {
          console.error('Error fetching positions:', error); // Log any errors
          this.positions = []; // Clear positions on error
        }
      );
    } else {
      this.positions = []; // Clear positions if no client is selected
    }
  }

  // Trigger file upload
  triggerFileUpload(): void {
    this.fileInput?.nativeElement.click(); // Programmatically click the file input
  }

  // Handle file selection
  onFileChange(event: any): void {
    this.selectedResume = event.target.files[0]; // Get the selected file
    if (this.selectedResume) {
      this.fileName = this.selectedResume.name; // Change the button text to the file name
    }
  }

  // Submit form data with success/error handling
  submitForm(): void {
    if (this.selectedClientName && this.selectedPosition && this.selectedResume) {
      const formData = new FormData();
      formData.append('client_name', this.selectedClientName);  // Client name
      formData.append('jd_filename', this.selectedPosition);     // JD filename
      formData.append('file', this.selectedResume);              // Uploaded resume file
  
      this.isUploading = true; // Start loading
      this.uploadStatus = null; // Reset status before submission
  
      // Post form data to the server
      this.http.post('/api/resume_upload/uploadResume', formData).subscribe(
        (response) => {
          this.isUploading = false; // Stop loading
          this.uploadStatus = 'success'; // Set status to success
          this.fileName = 'Upload Successful'; // Success message
  
          // Reload the page after a short delay for success
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.isUploading = false; // Stop loading
          this.uploadStatus = 'error'; // Set status to error
          this.fileName = 'Upload Failed'; // Error message
          console.error('Error submitting form:', error); // Log any errors
        }
      );
    } else {
      alert('Please select a client, position, and upload a resume.'); // Alert if fields are missing
    }
  }

  // Reset form after submission
  resetForm(): void {
    this.selectedClientName = '';
    this.selectedPosition = '';
    this.selectedResume = null;
    this.positions = [];
    this.fileName = 'Upload Resumes (PDF)'; // Reset file name text
    this.uploadStatus = null; // Reset upload status
  }
}
