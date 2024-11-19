import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Requirement } from '../requirements-master/requirement.model'; 
import { RequirementService } from '../requirements-master/client.service'; 
import { Client } from '../requirements-master/requirement.model';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requirements-form',
  standalone: true,
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class RequirementsFormComponent implements OnInit {
  requirementForm!: FormGroup;
  clients: Client[] = [];
  readonly: boolean = false; // Flag for read-only mode
  isEditing = false; // Set to true when editing an existing requirement

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequirementsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { requirement?: Requirement; clients: Client[]; readonly?: boolean },
    private requirementService: RequirementService // Renamed for clarity
  ) {}

  ngOnInit(): void {
    this.requirementForm = this.fb.group({
      rq_id: [this.data.requirement?.rq_id || 'string'], // Include rq_id for editing
      cl_id: [this.data.requirement?.cl_id || '', Validators.required], // Required
      rq_name: [this.data.requirement?.rq_name || '', Validators.required], // Required
      rq_loc: [this.data.requirement?.rq_loc || ''], // Removed required
      rq_map_url: [this.data.requirement?.rq_map_url || ''], 
      rq_no_pos: [this.data.requirement?.rq_no_pos || 1], // Removed required
      rq_qual: [this.data.requirement?.rq_qual || ''], // Removed required
      rq_skills: [this.data.requirement?.rq_skills || ''], // Removed required
      rq_exp: [this.data.requirement?.rq_exp || 0], // Removed required
      rq_work_mode: [this.data.requirement?.rq_work_mode || ''], // Removed required
      rq_budget: [this.data.requirement?.rq_budget || null], // Removed required
      rq_notes: [this.data.requirement?.rq_notes || ''], // Removed required
      rq_start_date: [this.data.requirement?.rq_start_date || null], // Removed required
      rq_no_of_days: [this.data.requirement?.rq_no_of_days || null], // Removed required
    });


    // Load clients for the dropdown
    this.clients = this.data.clients || [];
    this.readonly = this.data.readonly || false; // Set readonly flag
    this.isEditing = !!this.data.requirement; // Check if we're editing
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Log the form validity and errors for debugging
    console.log('Form validity:', this.requirementForm.valid);
    console.log('Form errors:', this.requirementForm.errors);

    if (this.requirementForm.valid && !this.readonly) {
      const selectedClientId = this.requirementForm.value.cl_id;
      const selectedClient = this.clients.find(client => client.cl_id === selectedClientId);
      const clientName = selectedClient ? selectedClient.cl_name : '';

      const formData = {
        ...this.requirementForm.value,
        cl_name: clientName // Add client name to the submitted data
      };

      console.log('Submitting form data:', formData); // Debug log to check submitted data
      this.dialogRef.close(formData); // Close the dialog and pass the form data
    } else if (this.readonly) {
      console.log("Viewing mode: no submission allowed.");
    } else {
      this.requirementForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      console.log("Form is invalid:", this.requirementForm.errors); // Log form errors
    }
  }
}