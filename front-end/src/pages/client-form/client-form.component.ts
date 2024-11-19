import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  imports: [CommonModule, FormsModule]
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
  isSubmitDisabled: boolean = false; 
  isAddContactDisabled: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientWithContacts
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.client = { ...this.data };

      switch (this.client.formType) {
        case 'view':
          this.formHeading = 'View Client';
          this.isSubmitDisabled = true;
          this.isAddContactDisabled = true;
          break;
        case 'update':
          this.formHeading = 'Edit Client';
          this.isSubmitDisabled = false;
          this.isAddContactDisabled = false;
          break;
        case 'add':
        default:
          this.formHeading = 'Add Client';
          this.isSubmitDisabled = false;
          this.isAddContactDisabled = false;
          break;
      }
    }
  }

  isEmailValid(email?: string): boolean {
    if (!email) return false; // 이메일이 undefined인 경우 false 반환
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isFormValid(): boolean {
    const clientNameValid = typeof this.client.cl_name === 'string' && this.client.cl_name.trim() !== '';
    const clientEmailValid = this.isEmailValid(this.client.cl_email); // 클라이언트 이메일은 이제 string | undefined를 처리함

    return clientNameValid && clientEmailValid;
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
    this.client.contacts.splice(index, 1);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
