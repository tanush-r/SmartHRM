import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, Requirement, Candidate } from '../candidate-master/candidate.model';
import { CandidateService } from '../candidate-master/client.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;
  clients: Client[] = [];
  requirements: Requirement[] = [];
  viewMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidate: Candidate | null; clients: Client[]; viewMode: boolean },
    private candidateService: CandidateService
  ) {
    // Initialize the form with validation
    this.candidateForm = this.fb.group({
      cl_id: ['', Validators.required],
      rq_id: ['', Validators.required],
      cd_first_name: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      cd_last_name: ['', [Validators.pattern('^[A-Za-z\\s]*$')]],
      cd_email: ['', [Validators.required, Validators.email]],
      cd_phno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      cd_loc: ['', [Validators.pattern('^[A-Za-z\\s]+$')]],
      cd_qual: ['', Validators.required],
      cd_total_exp: [0, [Validators.required, Validators.min(0)]],
      cd_related_exp: [0, [Validators.required, Validators.min(0)]],
      cd_cur_ctc: [0, [Validators.required, Validators.min(0)]],
      cd_exp_ctc: [0, [Validators.required, Validators.min(0)]],
      cd_notice: ['', Validators.required],
      cd_work_mode: [''],
      cd_valid_passport: [false],
      cd_skills: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.clients = this.data.clients;
    this.viewMode = this.data.viewMode;

    // Load requirements based on selected client
    this.candidateForm.get('cl_id')?.valueChanges.subscribe(clientId => {
      if (clientId) {
        this.loadRequirements(clientId);
      } else {
        this.requirements = [];
      }
    });

    // Patch existing candidate data if available
    if (this.data.candidate) {
      this.candidateForm.patchValue(this.data.candidate);
    }

    // Disable all form fields if in view mode
    if (this.viewMode) {
      this.candidateForm.disable();
    }
  }

  loadRequirements(clientId: string): void {
    this.candidateService.getRequirements(clientId).subscribe({
      next: (requirements) => {
        this.requirements = requirements;
      },
      error: (err) => {
        console.error('Error loading requirements:', err);
        this.requirements = []; // Reset requirements on error
        this.dialogRef.close(); // Close dialog if no requirements found
      }
    });
  }

  onSubmit(): void {
    if (this.candidateForm.valid && !this.viewMode) {
      const candidateData = this.candidateForm.value;
      this.dialogRef.close(candidateData);
    } else if (this.viewMode) {
      this.dialogRef.close(); // Close dialog without returning data in view mode
    } else {
      this.candidateForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      console.warn('Form is invalid:', this.candidateForm.errors);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isNumberKey = event.key >= '0' && event.key <= '9';
    const isAllowedKey = allowedKeys.includes(event.key);
  
    if (!isNumberKey && !isAllowedKey) {
      event.preventDefault();
    }
  }
}
