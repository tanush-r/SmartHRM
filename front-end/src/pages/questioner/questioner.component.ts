import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ClientService, Question, PrimaryDetail, Status } from './client.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ResumeStateService } from '../resumelist/resumestate.service'; // Ensure you import the ResumeStateService

export interface JDQuestionsResponse {
  questions_and_answers: Question[];
  error?: string; // Optional error property
}

@Component({
  selector: 'app-questioner',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    PdfViewerModule,
    NgxDocViewerModule,
    SkeletonModule,
    AccordionModule,
    FormsModule
  ],
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  activeTab: string = 'resume-summary';
  isJDQuestionsVisible: boolean = false;
  isResumeQuestionsVisible: boolean = false;
  resumeId: string | null = null;
  jdQuestions: Question[] = [];
  resumeQuestions: Question[] = [];
  clientId: string = 'your_client_id'; // Replace with your actual client ID
  resumeS3Link: string | null = null;
  positionS3Link: string | null = null;
  zoomLevel: number = 1.0;
  isLoadingJD: boolean = false; // Loading state for JD
  isLoadingResume: boolean = false; // Loading state for Resume
  currentFileUrl: string | null = null;
  isPdfFile: boolean = false;
  isDocxFile: boolean = false;
  isFileLoaded: boolean = false;
  isResumeLoaded: boolean = false;
  isJDLoaded: boolean = false;
  primaryDetails: PrimaryDetail | null = null; // Holds a single PrimaryDetail object
  isLoadingPrimaryDetails: boolean = false;
  errorMessage: string = '';
  statuses: Status[] = []; // List of statuses
  selectedStatusId: string | null = null; // Selected status ID
  resumeStatus: any; // Variable to store the resume status
  isJDGenerated: boolean = false;
  jdId: string | null = null; // JD ID should be string
  isResumeGenerated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private resumeStateService: ResumeStateService // Inject the ResumeStateService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resumeS3Link = params['resumeS3Link'] || '';
      this.positionS3Link = params['positionS3Link'] || '';
      this.resumeId = params['resumeId'] || null;
      this.jdId = params['jdId'] || null; // Fetch JD ID from query params
      this.isPdfFile = this.checkFileType(this.resumeS3Link);
      this.isDocxFile = !this.isPdfFile;
      this.currentFileUrl = this.isPdfFile ? this.resumeS3Link : this.isDocxFile ? this.resumeS3Link : null;
      this.isFileLoaded = !!this.currentFileUrl;
      console.log('Resume URL:', this.resumeS3Link);
      console.log('JD URL:', this.positionS3Link);
    });

    if (this.resumeId) {
      this.fetchPrimaryDetails(this.resumeId);
      this.fetchResumeStatus(this.resumeId); // Fetch resume status
    }

    this.fetchStatuses();
  }

  checkFileType(fileUrl: string | null): boolean {
    return fileUrl ? fileUrl.endsWith('.pdf') : false;
  }

  // JD Based Question Generation
  generateJDQuestions(jdId: string): void {
    const count = 5;
    this.isLoadingJD = true; // Show loading state
    if (!jdId) {
      this.snackBar.open('JD ID is missing.', 'Close', { duration: 3000 });
      this.isLoadingJD = false;
      return;
    }
    this.clientService.getJDQuestions(count, jdId, this.clientId).subscribe(
      (response: JDQuestionsResponse) => {
        if (response.error) {
          this.snackBar.open(response.error, 'Close', { duration: 3000 });
          this.jdQuestions = []; // Clear questions
          this.isJDQuestionsVisible = false;
        } else {
          this.jdQuestions = response.questions_and_answers;
          this.isJDQuestionsVisible = true;
          this.isJDLoaded = true;
          this.isJDGenerated = true; // Mark as generated
        }
      },
      error => {
        console.error('Error generating JD questions:', error);
        this.snackBar.open('An error occurred while generating JD questions.', 'Close', { duration: 3000 });
      },
      () => {
        this.isLoadingJD = false;
      }
    );
  }

  regenerateJDQuestions(): void {
    if (this.jdId) {
      this.generateJDQuestions(this.jdId); // Ensure jdId is not null before calling
    } else {
      this.snackBar.open('JD ID is missing.', 'Close', { duration: 3000 });
    }
  }

  // Resume Based Question Generation
  generateResumeQuestions(resumeId: string): void {
    const count = 5;
    this.isLoadingResume = true; // Show loading state for resume questions
    if (resumeId) {
      this.clientService.getResumeQuestions(count, resumeId, this.clientId).subscribe(
        response => {
          this.resumeQuestions = response.questions_and_answers;
          this.isResumeQuestionsVisible = true;
          this.isResumeLoaded = true;
          this.isResumeGenerated = true; // Mark as generated
        },
        error => {
          console.error('Error generating Resume questions:', error);
        },
        () => {
          this.isLoadingResume = false; // Hide loading state after loading
        }
      );
    } else {
      this.snackBar.open('Resume ID is missing.', 'Close', { duration: 3000 });
    }
  }

  regenerateResumeQuestions(): void {
    if (this.resumeId) {
      this.generateResumeQuestions(this.resumeId); // Ensure resumeId is not null before calling
    } else {
      this.snackBar.open('Resume ID is missing.', 'Close', { duration: 3000 });
    }
  }

  // Set Active Tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'resume-summary' && !this.isResumeLoaded) {
      this.currentFileUrl = this.resumeS3Link;
      this.isFileLoaded = true;
    } else if (tab === 'resume' && !this.isJDLoaded) {
      this.currentFileUrl = this.positionS3Link;
      this.isFileLoaded = true;
    }
  }

  toggleJDQuestions(): void {
    this.isJDQuestionsVisible = !this.isJDQuestionsVisible;
    if (this.isJDQuestionsVisible && !this.isJDGenerated) {
      if (this.jdId) {
        this.generateJDQuestions(this.jdId); // Ensure jdId is not null before calling
      } else {
        this.snackBar.open('JD ID is missing.', 'Close', { duration: 3000 });
      }
    }
  }

  toggleResumeQuestions(): void {
    this.isResumeQuestionsVisible = !this.isResumeQuestionsVisible;
    if (this.isResumeQuestionsVisible && !this.isResumeGenerated) {
      if (this.resumeId) {
        this.generateResumeQuestions(this.resumeId); // Ensure resumeId is not null before calling
      } else {
        this.snackBar.open('Resume ID is missing.', 'Close', { duration: 3000 });
      }
    }
  }

  zoomIn(): void {
    this.zoomLevel += 0.1;
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  // Fetch Primary Details
  fetchPrimaryDetails(resumeId: string): void {
    this.isLoadingPrimaryDetails = true;
    this.clientService.getPrimaryDetails(resumeId).subscribe(
      (data) => {
        this.primaryDetails = data;
        this.isLoadingPrimaryDetails = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load primary details';
        console.error('Error fetching primary details:', error);
        this.isLoadingPrimaryDetails = false;
      }
    );
  }

  // Fetch Resume Status
  fetchResumeStatus(resumeId: string): void {
    this.clientService.getResumeStatus(resumeId).subscribe(
      (status) => {
        this.resumeStatus = status;
        if (status) {
          this.selectedStatusId = status.st_id; // Assume the status object has a property st_id
        }
      },
      (error) => {
        console.error('Error fetching resume status:', error);
        this.snackBar.open('Error fetching resume status.', 'Close', { duration: 3000 });
      }
    );
  }

  // Fetch Statuses
  fetchStatuses(): void {
    this.clientService.getStatuses().subscribe(
      (statuses) => {
        this.statuses = statuses;
      },
      (error) => {
        console.error('Error fetching statuses:', error);
      }
    );
  }
  
  // Update Resume Status
  updateStatus(resumeId: string): void {
    if (this.selectedStatusId && resumeId) {
        this.clientService.updateResumeStatus(resumeId, this.selectedStatusId).subscribe(
            response => {
                console.log('Status updated successfully', response);
                this.snackBar.open('Status updated successfully.', 'Close', { duration: 3000 });

                // Update the local state with the new status
                const updatedResumes = this.resumeStateService.getResumes().map(resume => {
                    if (resume.resume_id === resumeId) {
                        return {
                            ...resume,
                            st_id: this.selectedStatusId, // Update to the new status ID
                            st_name: this.getStatusName(this.selectedStatusId!) // Update status name
                        };
                    }
                    return resume;
                });
                
                // Update the state service with the new list
                this.resumeStateService.setResumes(updatedResumes);
            },
            error => {
                console.error('Error updating status', error);
                this.snackBar.open('Failed to update status. Please try again.', 'Close', { duration: 3000 });
            }
        );
    } else {
        console.error('Cannot update status: selectedStatusId or resumeId is missing.');
        this.snackBar.open('Please select a status and ensure the resume ID is valid.', 'Close', { duration: 3000 });
    }
}


  // Helper method to get the status name based on the ID
  private getStatusName(statusId: string): string {
    const status = this.statuses.find(s => s.st_id === statusId);
    return status ? status.st_name : 'Unknown Status';
  }

  // Navigate to the resume list
  resumelist() {
    this.router.navigate(['/resumelist']); // Update the route as per your application structure
  }
}

