import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, Requirement, Candidate } from '../candidate-master/candidate.model';
import { CandidateService } from '../candidate-master/client.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  clients: Client[] = [];
  requirements: Requirement[] = [];
  viewMode: boolean = false; // Flag to indicate view mode

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidate: Candidate | null; clients: Client[]; viewMode: boolean },
    private candidateService: CandidateService // Inject the service
  ) {
    this.candidateForm = this.fb.group({
      cl_id: ['', Validators.required], // Client ID
      rq_id: ['', Validators.required], // Requirement ID
      cd_first_name: ['', Validators.required], // Candidate first name
      cd_last_name: [''], // Candidate last name (optional)
      cd_email: ['', [Validators.required, Validators.email]], // Make email mandatory with email validation
      cd_phno: [''], // Phone number (optional)
      cd_loc: [''], // Location (optional)
      cd_qual: [''], // Qualification (optional)
      cd_total_exp: [0, [Validators.min(0)]], // Total experience (default to 0)
      cd_related_exp: [0, [Validators.min(0)]], // Relevant experience (default to 0)
      cd_cur_ctc: [0, [Validators.min(0)]], // Current CTC (default to 0)
      cd_exp_ctc: [0, [Validators.min(0)]], // Expected CTC (default to 0)
      cd_notice: [''], // Notice period (optional)
      cd_work_mode: [''], // Work mode (optional)
      cd_valid_passport: [false], // Valid passport status (optional)
      cd_skills: [''], // Skills (optional)
    });
  }

  ngOnInit() {
    this.clients = this.data.clients; // Assign clients from dialog data
    this.viewMode = this.data.viewMode; // Set view mode based on dialog data

    // Load requirements based on selected client
    this.candidateForm.get('cl_id')?.valueChanges.subscribe(clientId => {
      if (clientId) {
        this.loadRequirements(clientId); // Fetch requirements for the selected client
      } else {
        this.requirements = []; // Reset requirements if no client is selected
      }
    });

    // Patch existing candidate data if available
    if (this.data.candidate) {
      this.candidateForm.patchValue({
        cl_id: this.data.candidate.cl_id || '',
        rq_id: this.data.candidate.rq_id || '',
        cd_first_name: this.data.candidate.cd_first_name || '',
        cd_last_name: this.data.candidate.cd_last_name || '',
        cd_email: this.data.candidate.cd_email || '',
        cd_phno: this.data.candidate.cd_phno || '',
        cd_loc: this.data.candidate.cd_loc || '',
        cd_qual: this.data.candidate.cd_qual || '',
        cd_skills: this.data.candidate.cd_skills || '',
        cd_total_exp: this.data.candidate.cd_total_exp || 0,
        cd_related_exp: this.data.candidate.cd_related_exp || 0,
        cd_cur_ctc: this.data.candidate.cd_cur_ctc || 0,
        cd_exp_ctc: this.data.candidate.cd_exp_ctc || 0,
        cd_notice: this.data.candidate.cd_notice || '',
        cd_work_mode: this.data.candidate.cd_work_mode || '',
        cd_valid_passport: this.data.candidate.cd_valid_passport || false,
      });
    }

    // If in view mode, disable all form fields
    if (this.viewMode) {
      this.candidateForm.disable(); // Disable the form for viewing
    }
  }

  loadRequirements(clientId: string): void {
    this.candidateService.getRequirements(clientId).subscribe({
      next: (requirements) => {
        this.requirements = requirements; // Update the requirements based on the selected client
      },
      error: (err) => console.error('Error loading requirements:', err)
    });
  }

  onSubmit() {
    console.log('Submit called', this.candidateForm.valid, this.viewMode); // Check form validity and view mode
    if (this.candidateForm.valid && !this.viewMode) { // Only submit if not in view mode
      const candidateData = this.candidateForm.value; // Get form data
      console.log('Candidate data to submit:', candidateData); // Log candidate data
      this.dialogRef.close(candidateData); // Close dialog and return data
    } else if (this.viewMode) {
      console.log('Form is in view mode, closing dialog without submitting data.');
      this.dialogRef.close(); // Close dialog without returning data in view mode
    } else {
      console.log('Form is invalid:', this.candidateForm.errors); // Log any form errors
      this.candidateForm.markAllAsTouched(); // Mark all fields as touched to show errors
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close dialog
  }
}
