import { Component, ElementRef, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
interface Client {
  client_name: string;
}
interface PositionResponse {
  jd_filenames: string[];
}
@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, PdfViewerModule, NgxDocViewerModule],
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResumeUploadComponent implements OnInit {
  clients: Client[] = [];
  positions: string[] = [];
  selectedClientName: string = '';
  selectedPosition: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadStatus: 'success' | 'error' | null = null;
  fileName: string = 'Upload Resume (PDF or DOCX)';
  fileSize: number | null = null; // Store file size
  isFileViewActive: boolean = false; // Control visibility of file preview
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  pdfSrc: string | undefined = undefined;
  docSrc: string | undefined = undefined;
  showPdfViewer = false;
  showDocViewer = false;
  isPdfFile: boolean = false;
  isDocxFile: boolean = false;
  zoomLevel: number = 1;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.loadClients();
  }
  loadClients(): void {
    this.http.get<Client[]>('http://localhost:8000/clients').subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }
  onClientChange(): void {
    if (this.selectedClientName) {
      this.http.get<PositionResponse>(`http://localhost:8000/jd_filenames_by_name/${this.selectedClientName}`).subscribe(
        (data) => {
          this.positions = data.jd_filenames;
        },
        (error) => {
          console.error('Error fetching positions:', error);
          this.positions = [];
        }
      );
    } else {
      this.positions = [];
    }
  }
  triggerFileUpload(): void {
    this.fileInput?.nativeElement.click();
  }
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
    if (this.selectedFile) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const extension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      console.log('File extension:', extension);
      // Handle Google Docs file
      if (extension === 'gdoc') {
        alert('Google Docs files cannot be uploaded directly. Please download as PDF or DOCX and upload.');
        this.selectedFile = null;
        this.fileName = 'Upload Resume (PDF or DOC)';
        return;
      }
      // Check file size (10 MB limit)
      if (this.selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10 MB.');
        this.selectedFile = null;
        this.fileName = 'Upload Resume (PDF or DOC)';
        return;
      }
      if (allowedExtensions.includes(extension!)) {
        this.fileName = this.selectedFile.name;
        this.fileSize = this.selectedFile.size; // Store file size
        this.resetViewers();
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = btoa(e.target?.result as string);
          this.isFileViewActive = true; // Show the file view immediately when the file is read
          if (extension === 'pdf') {
            this.pdfSrc = `data:application/pdf;base64,${base64String}`;
            this.showPdfViewer = true;
            this.showDocViewer = false;
            this.isPdfFile = true;
            this.isDocxFile = false;
          } else if (extension === 'doc' || extension === 'docx') {
            this.docSrc = `data:application/msword;base64,${base64String}`;
            this.showDocViewer = true;
            this.showPdfViewer = false;
            this.isDocxFile = true;
            this.isPdfFile = false;
          }
        };
        reader.readAsBinaryString(this.selectedFile);
      } else {
        alert('Only PDF, DOC, or DOCX files are allowed.');
        this.selectedFile = null;
        this.fileName = 'Upload Resume (PDF or DOC)';
      }
    }
  }
  submitForm(): void {
    if (this.selectedClientName && this.selectedPosition && this.selectedFile) {
      const formData = new FormData();
      formData.append('client_name', this.selectedClientName);
      formData.append('jd_filename', this.selectedPosition);
      formData.append('file', this.selectedFile);
      this.isUploading = true;
      this.uploadStatus = null;
      this.http.post('http://localhost:8000/uploadResume', formData).subscribe(
        () => {
          this.isUploading = false;
          this.uploadStatus = 'success';
          this.fileName = 'Upload Successful';
          this.isFileViewActive = true; // Show the file view immediately after upload
        },
        (error) => {
          this.isUploading = false;
          this.uploadStatus = 'error';
          this.fileName = 'Upload Failed';
          console.error('Error submitting form:', error);
        }
      );
    } else {
      alert('Please select a client, position, and upload a resume.');
    }
  }
  resetForm(): void {
    this.selectedClientName = '';
    this.selectedPosition = '';
    this.selectedFile = null;
    this.positions = [];
    this.fileName = 'Upload Resume (PDF or DOC)';
    this.resetViewers();
  }
  resetViewers(): void {
    this.showPdfViewer = false;
    this.showDocViewer = false;
    this.isFileViewActive = false;
    this.pdfSrc = undefined;
    this.docSrc = undefined;
    this.isPdfFile = false;
    this.isDocxFile = false;
    this.fileSize = null; // Reset file size
  }
  // Method to toggle file view visibility
  toggleFileView(): void {
    this.isFileViewActive = !this.isFileViewActive;
  }
  // Method to zoom in on the document
  zoomIn(): void {
    this.zoomLevel += 0.1; // Increase zoom level
  }
  // Method to zoom out of the document
  zoomOut(): void {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1; // Decrease zoom level
    }
  }
}