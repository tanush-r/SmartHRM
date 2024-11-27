import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ClientService, Question } from './client.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion'; 

@Component({
  selector: 'app-questioner',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, PdfViewerModule, NgxDocViewerModule, SkeletonModule, AccordionModule],
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
  clientId: string = 'your_client_id'; 
  resumeS3Link: string | null = null; 
  positionS3Link: string | null = null; 
  zoomLevel: number = 1.0; 
  isLoadingJD: boolean = false; // Loader state for JD questions
  isLoadingResume: boolean = false; // Loader state for Resume questions
  currentFileUrl: string | null = null; // Holds the current file URL
  isPdfFile: boolean = false; 
  isDocxFile: boolean = false; 
  isFileLoaded: boolean = false; // Track if the file has been loaded
  
  // Flags to persist loaded state
  isResumeLoaded: boolean = false;
  isJDLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private clientService: ClientService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resumeS3Link = params['resumeS3Link'] || ''; 
      this.positionS3Link = params['positionS3Link'] || ''; 
      this.resumeId = params['resumeId'];

      // Check local storage for existing resume data
      const storedResumeQuestions = localStorage.getItem('resumeQuestions');
      if (storedResumeQuestions) {
        this.resumeQuestions = JSON.parse(storedResumeQuestions);
        this.isResumeQuestionsVisible = true; // Set to visible if data exists
      }

      // Determine file type for resume
      this.isPdfFile = this.checkFileType(this.resumeS3Link); 
      this.isDocxFile = !this.isPdfFile; 

      // Set the current file URL based on the type if not loaded
      this.currentFileUrl = this.isPdfFile ? this.resumeS3Link : this.isDocxFile ? this.resumeS3Link : null;
      this.isFileLoaded = !!this.currentFileUrl; // Set loaded state based on initial URL

      console.log('Resume URL:', this.resumeS3Link);
      console.log('JD URL:', this.positionS3Link);
    });
  }

  checkFileType(fileUrl: string | null): boolean {
    return fileUrl ? fileUrl.endsWith('.pdf') : false;
  }

  generateJDQuestions(jdId: string) {
    const count = 5; 
    this.isLoadingJD = true; // Start loading
    this.clientService.getJDQuestions(count, jdId, this.clientId).subscribe(
      response => {
        console.log('JD Questions Response:', response);
        this.jdQuestions = response.questions_and_answers; 
        this.isJDQuestionsVisible = true; 
        this.isJDLoaded = true; // Mark JD as loaded
      },
      error => {
        console.error('Error generating JD questions:', error);
      },
      () => {
        this.isLoadingJD = false; // End loading
      }
    );
  }

  generateResumeQuestions() {
    const count = 5; 
    if (this.resumeId) {
      this.isLoadingResume = true; // Start loading
      this.clientService.getResumeQuestions(count, this.resumeId, this.clientId).subscribe(
        response => {
          this.resumeQuestions = response.questions_and_answers; 
          this.isResumeQuestionsVisible = true; 
          // Store the resume questions in local storage
          localStorage.setItem('resumeQuestions', JSON.stringify(this.resumeQuestions));
          this.isResumeLoaded = true; // Mark Resume as loaded
        },
        error => {
          console.error('Error generating Resume questions:', error);
        },
        () => {
          this.isLoadingResume = false; // End loading
        }
      );
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab; 

    // Update current file URL only if the file hasn't been loaded yet
    if (tab === 'resume-summary' && !this.isResumeLoaded) {
      this.currentFileUrl = this.resumeS3Link; // Set current file for Resume View
      this.isFileLoaded = true; // Mark the file as loaded
    } else if (tab === 'resume' && !this.isJDLoaded) {
      this.currentFileUrl = this.positionS3Link; // Set current file for JD View
      this.isFileLoaded = true; // Mark the file as loaded
    }
  }

  toggleJDQuestions(): void {
    this.isJDQuestionsVisible = !this.isJDQuestionsVisible; 
    if (this.isJDQuestionsVisible && !this.isJDLoaded) {
      const jdId = this.route.snapshot.queryParams['jdId']; 
      if (jdId) {
        this.generateJDQuestions(jdId); 
      }
    }
  }

  toggleResumeQuestions(): void {
    this.isResumeQuestionsVisible = !this.isResumeQuestionsVisible; 
    // If the questions are already visible, do not load again
    if (this.isResumeQuestionsVisible && this.resumeQuestions.length === 0) {
      this.generateResumeQuestions(); 
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

}
