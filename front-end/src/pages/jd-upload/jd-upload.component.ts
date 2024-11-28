import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClientService } from '../jd-upload/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-jd-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, PdfViewerModule, NgxDocViewerModule, RouterModule],
  templateUrl: './jd-upload.component.html',
  styleUrls: ['./jd-upload.component.css']
})
export class JDUploadComponent implements OnInit {
  clients: any[] = [];
  selectedClientName: string = '';
  selectedPosition: string = '';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  addClient(): void {
    this.router.navigate(['/clients-master']);
  }
  
  triggerFileUpload(): void {
    this.fileInput?.nativeElement.click();
  }

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

        // Automatically show the uploaded file preview
        this.displayFile(file);
      } else {
        alert('Only PDF, DOC, or DOCX files are allowed.');
        this.resetFile();
      }
    }
  }

  displayFile(file: File): void {
    this.isFileViewActive = true; // Automatically activate file view
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

  toggleFileView(): void {
    this.isFileViewActive = !this.isFileViewActive;
  }

  resetFile(): void {
    this.selectedFile = null;
    this.fileName = 'Upload Resume (PDF or DOC)';
    this.isFileViewActive = false; // Hide file view if reset
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
  }

  submitForm(): void {
    if (this.selectedClientName && this.selectedFile) {
      const formData = new FormData();
      formData.append('client_name', this.selectedClientName);
      formData.append('position', this.selectedPosition);
      formData.append('file', this.selectedFile);

      this.isUploading = true;
      this.uploadStatus = null;

      this.http.post('/api/jd_upload/uploadJD', formData).subscribe(
        () => {
          this.isUploading = false;
          this.uploadStatus = 'success';
          alert('JD uploaded successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error: any) => {
          this.isUploading = false;
          this.uploadStatus = 'error';
          console.error('Error submitting form:', error);
          alert('Failed to submit the form.');
        }
      );
    } else {
      alert('Please select a client and upload a file.');
    }
  }
}