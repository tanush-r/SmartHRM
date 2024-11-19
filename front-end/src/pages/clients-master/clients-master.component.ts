import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { ClientsService } from './client.service';
import { ClientWithContacts } from './client.model';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-clients-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clients-master.component.html',
  styleUrls: ['./clients-master.component.css'],
})
export class ClientsMasterComponent implements OnInit {
  clients: ClientWithContacts[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe(
      (clients: ClientWithContacts[]) => {
        this.clients = clients;
      },
      (error) => {
        this.snackBar.open('Failed to load clients. Please try again.', 'Close', { duration: 3000 });
        console.error('Failed to load clients:', error);
      }
    );
  }

  openAddClientForm(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        cl_name: '',
        cl_email: '',
        cl_phno: '',
        cl_addr: '',
        cl_map_url: '',
        cl_type: '',
        cl_notes: '',
        contacts: [{
          co_name: '', // Ensure this is defined
          co_position_hr: '',
          co_email: '',
          co_phno: ''
        }],
        formType: 'add' // Set formType to 'add' when creating a new client
      },
    });
  
    dialogRef.afterClosed().subscribe((result: ClientWithContacts | undefined) => {
      if (result) {
        this.clientsService.createClient(result).subscribe(
          () => {
            this.loadClients();
            this.snackBar.open('Client created successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Failed to create client. Please try again.', 'Close', { duration: 3000 });
            console.error('Failed to create client:', error);
          }
        );
      }
    });
  }
  

  openEditClientForm(client: ClientWithContacts): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        ...client,
        formType: 'update' // Set formType to 'update' for editing
      },
    });

    dialogRef.afterClosed().subscribe((result: ClientWithContacts | undefined) => {
      if (result && result.cl_id) {
        this.clientsService.updateClient(result.cl_id, result).subscribe(
          () => {
            this.loadClients();
            this.snackBar.open('Client updated successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Failed to update client. Please try again.', 'Close', { duration: 3000 });
            console.error('Failed to update client:', error);
          }
        );
      }
    });
  }

  openViewClientForm(client: ClientWithContacts): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        ...client,
        formType: 'view' // Set formType to 'view' for viewing
      },
    });

    dialogRef.afterClosed().subscribe(); // No need to handle result for view
  }

  deleteClient(client: ClientWithContacts): void {
    if (client.cl_id) { // Ensure cl_id is truthy
        const dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Use a non-null assertion here
                this.clientsService.deleteClient(client.cl_id!).subscribe(
                    () => {
                        this.loadClients();
                        this.snackBar.open('Client deleted successfully!', 'Close', { duration: 3000 });
                    },
                    (error) => {
                        this.snackBar.open('Failed to delete client. Please try again.', 'Close', { duration: 3000 });
                        console.error('Failed to delete client:', error);
                    }
                );
            } else {
                console.log('Client deletion was cancelled.');
            }
        });
    } else {
        console.error('Client ID is undefined, cannot delete client.');
    }
}


filterClients(): ClientWithContacts[] {
  return this.clients.filter(client =>
    client.cl_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
    (client.cl_email && client.cl_email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
    (client.cl_addr && client.cl_addr.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
    (client.contacts && client.contacts.length > 0 && 
      client.contacts[0].co_name.toLowerCase().includes(this.searchQuery.toLowerCase())) // Check primary contact name
  );
}
}
