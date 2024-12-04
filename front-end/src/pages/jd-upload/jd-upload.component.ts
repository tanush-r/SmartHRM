import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { RouterModule } from '@angular/router';
import { ClientService } from '../jd-upload/client.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
@Component({
  selector: 'app-jd-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    NgxDocViewerModule,
    RouterModule,
    HttpClientModule,
    MatDialogModule,
  ],
  templateUrl: './jd-upload.component.html',
  styleUrls: ['./jd-upload.component.css']
})
export class JDUploadComponent implements OnInit {
  // Client data
  clients: any[] = [];
  selectedClientName: string = '';
  selectedPosition: string = '';
  // File handling
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadStatus: 'success' | 'error' | null = null;
  fileName: string = 'Upload JD (PDF or DOCX)';
  isFileViewActive: boolean = false;
  pdfSrc: string | null = null;
  docSrc: string | null = null;
  isPdfFile: boolean = false;
  isDocxFile: boolean = false;
  zoomLevel: number = 1;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  constructor(
    private clientService: ClientService,
    private http: HttpClient,
    private dialog: MatDialog // Inject MatDialog
  ) {}
  ngOnInit(): void {
    this.loadClients(); // Load clients when the component initializes
  }
  loadClients(): void {
    this.clientService.getClients().subscribe(
        (data: any[]) => {
            this.clients = data;
        },
        error => {
            console.error('Error fetching clients:', error);
        }
    );
}
 // Open ClientFormComponent as a dialog
 addClient(): void {
  const dialogRef = this.dialog.open(ClientFormComponent, {
    height: '600px',
    width: '700px',
    data: {
      cl_name: '',
      cl_email: '',
      cl_phno: '',
      cl_addr: '',
      cl_map_url: '',
      cl_type: '',
      cl_notes: '',
      contacts: [{
        co_name: '',
        co_position_hr: '',
        co_email: '',
        co_phno: ''
      }],
      formType: 'add'
    },
  });
  // Optionally handle the dialog close event
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Reload client data or perform other actions
      this.loadClients();
    }
  });
}
  // Trigger file upload dialog
  triggerFileUpload(): void {
    this.fileInput?.nativeElement.click();
  }
  // Handle file selection
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10 MB.');
        this.resetFile();
        return;
      }
      if (extension && allowedExtensions.includes(extension)) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.displayFile(file);
      } else {
        alert('Only PDF, DOC, or DOCX files are allowed.');
        this.resetFile();
      }
    }
  }
  // Display the selected file for preview
  displayFile(file: File): void {
    this.isFileViewActive = true;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    this.isPdfFile = fileExtension === 'pdf';
    this.isDocxFile = fileExtension === 'docx';
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.isPdfFile) {
        this.pdfSrc = e.target.result;
      } else if (this.isDocxFile) {
        this.docSrc = e.target.result;
      } else {
        alert('Unsupported file type');
      }
    };
    reader.readAsDataURL(file);
  }
  // Toggle file preview visibility
  toggleFileView(): void {
    this.isFileViewActive = !this.isFileViewActive;
  }
  // Reset file input and preview
  resetFile(): void {
    this.selectedFile = null;
    this.fileName = 'Upload JD (PDF or DOC)';
    this.isFileViewActive = false;
    this.pdfSrc = null;
    this.docSrc = null;
    this.isPdfFile = false;
    this.isDocxFile = false;
  }
  // Zoom in document view
  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
  }
  // Zoom out document view
  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
  }
  // Submit the JD form
  submitForm(): void {
    if (this.selectedClientName && this.selectedFile) {
      const formData = new FormData();
      formData.append('client_name', this.selectedClientName); // Ensure using 'client_name'
      formData.append('file', this.selectedFile); // Append the file
      this.isUploading = true;
      this.uploadStatus = null; // Reset status
      this.http.post('/api/jd_upload/uploadJD', formData)
        .subscribe(
          response => {
            this.isUploading = false;
            this.uploadStatus = 'success'; // Set status to success
            // Optional: Display success message or redirec
             // Reload the page after a short delay (e.g., 1 second)
          setTimeout(() => {
            window.location.reload(); // Reload the page
          }, 2000);
          },
          (error: any) => {
            this.isUploading = false;
            this.uploadStatus = 'error'; // Set status to error
            console.error('Error submitting form:', error);
            // Display detailed error message
            if (error.error && error.error.message) {
              alert('Error: ' + error.error.message); // Customize this based on actual error response
            } else {
              alert('Failed to submit the form.'); // Fallback message
            }
          }
        );
    } else {
      alert('Please select a client and upload a file.');
    }
  }
}
