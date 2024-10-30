import { Component, OnInit } from '@angular/core';
import { ClientService } from '../jd-upload/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jd-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jd-upload.component.html',
  styleUrls: ['./jd-upload.component.css']
})
export class JDUploadComponent implements OnInit {
  newClientName: string = '';
  clients: any[] = []; // Array to hold the clients
  selectedClientName: string = ''; // To store the client name
  selectedFile: File | null = null; // To hold the uploaded file
  isUploading: boolean = false; // To manage the upload state (loading spinner)
  uploadStatus: 'success' | 'error' | null = null; // Track upload success or error
  fileName: string = ''; // To display the uploaded file name

  constructor(private clientService: ClientService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients(); // Load clients when the component initializes
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data: any[]) => {
        this.clients = data; // Populate the clients array with data from the API
      },
      error => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  addClient(): void {
    if (this.newClientName.trim()) {
      this.clientService.addClient(this.newClientName).subscribe(
        response => {
          alert('Client added successfully!');
          this.newClientName = ''; // Clear the input after successful addition
          this.loadClients(); // Reload clients to reflect the new addition
        },
        error => {
          console.error('Error adding client:', error);
          alert('Failed to add client.');
        }
      );
    } else {
      alert('Please enter a client name.');
    }
  }

  // Capture the file when it's selected
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name; // Store the file name for display
    }
  }

  submitForm(): void {
    if (this.selectedClientName && this.selectedFile) {
      const formData = new FormData();
      formData.append('client_name', this.selectedClientName); // Use client name here
      formData.append('file', this.selectedFile); // Append the file
  
      this.isUploading = true;
      this.uploadStatus = null; // Reset status
  
      // Send the form data to the backend
      this.http.post('/api/jd_upload/uploadJD', formData).subscribe(
        response => {
          this.isUploading = false;
          this.uploadStatus = 'success'; // Set status to success
         // Display success message
  
          // Reload the page after a short delay (e.g., 1 second)
          setTimeout(() => {
            window.location.reload(); // Reload the page
          }, 1000);
        },
        (error: any) => {
          this.isUploading = false;
          this.uploadStatus = 'error'; // Set status to error
          console.error('Error submitting form:', error);
          alert('Failed to submit the form.');
        }
      );
    } else {
      alert('Please select a client and upload a file.');
    }
  }
}