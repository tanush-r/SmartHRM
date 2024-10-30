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
  imports: [CommonModule, RouterLink, RouterOutlet, PdfViewerModule,NgxDocViewerModule,SkeletonModule,AccordionModule],
  templateUrl: './questioner.component.html',
  styleUrls: ['./questioner.component.css']
})
export class QuestionerComponent implements OnInit {
  activeTab: string = 'resume-summary'; 
  isJDQuestionsVisible: boolean = false; 
  isResumeQuestionsVisible: boolean = false; 
  resumeId: string | null = null;
  pdfSrc: string | ArrayBuffer | null = null; 
  jdQuestions: Question[] = []; 
  resumeQuestions: Question[] = []; 
  clientId: string = 'your_client_id'; 
  resumeS3Link: string | null = null; 
  positionS3Link: string | null = null; 
  zoomLevel: number = 1.0; 
  isLoadingJD: boolean = false; // Loader state for JD questions
  isLoadingResume: boolean = false; // Loader state for Resume questions
  isPdfFile: boolean = false; 
  isDocxFile: boolean = false; 

  constructor(private route: ActivatedRoute, private clientService: ClientService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resumeS3Link = params['resumeS3Link'] || ''; 
      this.positionS3Link = params['positionS3Link'] || ''; 
      this.resumeId = params['resumeId'];

        // Determine file type for resume
        this.isPdfFile = this.checkFileType(this.resumeS3Link || ''); // Provide a default empty string
        this.isDocxFile = !this.isPdfFile; // Assuming only PDF or DOCX
      
      console.log('Resume ID:', this.resumeS3Link);
      console.log('Position ID:', this.positionS3Link);
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
  }

  toggleJDQuestions(): void {
    this.isJDQuestionsVisible = !this.isJDQuestionsVisible; 
    if (this.isJDQuestionsVisible) {
      const jdId = this.route.snapshot.queryParams['jdId']; 
      if (jdId) {
        this.generateJDQuestions(jdId); 
      }
    }
  }

  toggleResumeQuestions(): void {
    this.isResumeQuestionsVisible = !this.isResumeQuestionsVisible; 
    if (this.isResumeQuestionsVisible) {
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