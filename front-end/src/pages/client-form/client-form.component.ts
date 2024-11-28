import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface Contact {
  co_id?: string;
  co_name: string;
  co_position_hr?: string;
  co_email: string;
  co_phno: string;
}

interface ClientWithContacts {
  cl_id?: string;
  cl_name: string;
  cl_email?: string;
  cl_phno?: string;
  cl_addr?: string;
  cl_map_url?: string;
  cl_type?: string;
  cl_notes?: string; 
  contacts: Contact[];
  formType?: 'add' | 'update' | 'view';
}

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class ClientFormComponent implements OnInit {
  client: ClientWithContacts = {
    cl_name: '',
    cl_email: '',
    cl_phno: '',
    cl_addr: '',
    cl_map_url: '',
    cl_type: '',
    cl_notes: '',
    contacts: [],
    formType: 'add'
  };

  submitted: boolean = false;
  formHeading: string = '';

  constructor(
    private dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientWithContacts
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.client = { ...this.data };
      this.formHeading = this.client.formType === 'update' ? 'Edit Client' : 'Add Client';
    }
  }

  isEmailValid(email?: string): boolean {
    if (!email) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isPhoneNumberValid(phoneNumber?: string): boolean {
    if (!phoneNumber) return false; 
    const phonePattern = /^\+\d{1,3}\d{9,}$/;
    return phonePattern.test(phoneNumber);
  }

  isFormValid(): boolean {
    const clientNameValid = this.client.cl_name.trim() !== '';
    const clientEmailValid = this.isEmailValid(this.client.cl_email);
    const clientPhoneValid = this.isPhoneNumberValid(this.client.cl_phno);
    const primaryContactNameValid = this.client.contacts[0]?.co_name.trim() !== ''; // Ensure primary contact name is checked

    return clientNameValid && clientEmailValid && clientPhoneValid && primaryContactNameValid;
  }

  onSubmit() {
    this.submitted = true;
    if (this.isFormValid()) {
      this.dialogRef.close(this.client);
    }
  }

  addContactPerson() {
    const newContactPerson: Contact = {
      co_name: '',
      co_position_hr: '',
      co_email: '',
      co_phno: ''
    };
    this.client.contacts.push(newContactPerson);
  }

  removeContactPerson(index: number): void {
    if (index > 0) { 
      this.client.contacts.splice(index, 1);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
