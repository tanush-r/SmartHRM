import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { RequirementsFormComponent } from '../requirements-form/requirements-form.component'; 
import { Requirement, Client } from './requirement.model'; 
import { RequirementService } from './client.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-requirements-master',
  templateUrl: './requirements-master.component.html',
  styleUrls: ['./requirements-master.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RequirementsMasterComponent implements OnInit {
  requirements: Requirement[] = [];
  filteredRequirements: Requirement[] = [];
  clients: Client[] = []; 
  searchQuery: string = '';
  selectedClient: string | null = null; 

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private requirementService: RequirementService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients(); 
  }

  loadRequirements(clientId: string | null): void {
    if (clientId) {
      this.requirementService.getRequirementsByClient(clientId).subscribe(
        (requirements) => {
          this.requirements = requirements;
          this.filteredRequirements = requirements; 
        },
        (error) => {
          this.snackBar.open('No Requirements for this client.', 'Close', { duration: 3000 });
          console.error('Failed to load requirements:', error);
        }
      );
    } else {
      this.requirements = [];
      this.filteredRequirements = [];
    }
  }

  loadClients(): void {
    this.requirementService.getClients().subscribe(
      (clients) => {
        this.clients = clients; 
      },
      (error) => {
        this.snackBar.open('Failed to load clients. Please try again later.', 'Close', { duration: 3000 });
        console.error('Failed to load clients:', error);
      }
    );
  }

  filterRequirements(): void {
    // Load requirements based on the selected client
    this.loadRequirements(this.selectedClient);
    
    // Filter requirements based on the search query
    this.filteredRequirements = this.requirements.filter(requirement =>
      (requirement.rq_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      requirement.rq_loc.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      requirement.rq_skills.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedClient ? requirement.cl_id === this.selectedClient : true) // Ensure the client matches if one is selected
    );
  }

  addRequirement(): void {
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { clients: this.clients },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.cl_id) {
        this.requirementService.createRequirement(result.cl_id, result).subscribe(
          (response) => {
            const newRequirement: Requirement = {
              rq_id: response.requirement_id,
              cl_id: result.cl_id,
              rq_name: result.rq_name,
              rq_loc: result.rq_loc,
              rq_map_url: result.rq_map_url,
              rq_no_pos: result.rq_no_pos,
              rq_qual: result.rq_qual,
              rq_skills: result.rq_skills,
              rq_exp: result.rq_exp,
              rq_budget: result.rq_budget,
              rq_work_mode: result.rq_work_mode,
              rq_start_date: result.rq_start_date,
              rq_no_of_days: result.rq_no_of_days,
              rq_notes: result.rq_notes,
              created_by: result.created_by,
            };
            this.requirements.push(newRequirement);
            this.filteredRequirements = [...this.requirements]; 
            this.snackBar.open('Requirement added successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Failed to create requirement. Please try again.', 'Close', { duration: 3000 });
            console.error('Failed to create requirement:', error);
          }
        );
      }
    });
  }  

  viewRequirement(requirement: Requirement): void {
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { 
        requirement: requirement, 
        readonly: true,
        clients: this.clients,
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  editRequirement(requirement: Requirement): void {
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { 
        requirement: requirement, 
        clients: this.clients,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requirementService.updateRequirement(result.rq_id, result).subscribe(
          (response) => {
            const updatedRequirement: Requirement = {
              ...requirement,
              ...result,
            };
            const index = this.requirements.findIndex(r => r.rq_id === updatedRequirement.rq_id);
            if (index !== -1) {
              this.requirements[index] = updatedRequirement;
            }
            this.filteredRequirements = [...this.requirements];
            this.snackBar.open('Requirement updated successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            console.error('Failed to update requirement:', error);
            this.snackBar.open('Failed to update requirement. Please try again.', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
  
  deleteRequirement(requirement: Requirement): void {
    if (requirement.rq_id) { // Ensure rq_id is defined
        const dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.requirementService.deleteRequirement(requirement.rq_id).subscribe(
                    () => {
                        this.requirements = this.requirements.filter(r => r.rq_id !== requirement.rq_id);
                        this.filteredRequirements = [...this.requirements];
                        this.snackBar.open('Requirement deleted successfully!', 'Close', { duration: 3000 });
                    },
                    (error) => {
                        this.snackBar.open('Failed to delete requirement. Please try again.', 'Close', { duration: 3000 });
                        console.error('Failed to delete requirement:', error);
                    }
                );
            } else {
                console.log('Requirement deletion was cancelled.');
            }
        });
    } else {
        console.error('Requirement ID is undefined, cannot delete requirement.');
    }
  }
}
