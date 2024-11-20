import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component'; 
import { CandidateService } from '../candidate-master/client.service'; 
import { Candidate, Client, Requirement } from '../candidate-master/candidate.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSelectChange } from '@angular/material/select'; // Import MatSelectChange
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-candidate-master',
  templateUrl: './candidate-master.component.html',
  styleUrls: ['./candidate-master.component.css'],
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule
  ]
})
export class CandidateMasterComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  clients: Client[] = [];
  requirements: Requirement[] = [];
  searchQuery: string = '';
  
  selectedClientId: string | null = null; 
  selectedRequirementId: string | null = null; 
  clientsLoaded: boolean = false; 

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadCandidates();
  }

  loadClients(): void {
    this.candidateService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientsLoaded = true; 
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.clientsLoaded = false; 
      }
    });
  }
  
  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.filteredCandidates = candidates.length > 0 ? candidates : [];
        
        if (candidates.length === 0) {
            console.warn('No candidates found.'); 
        }
      },
      error: (err) => {
        console.error('Error loading candidates:', err);
        this.candidates = []; 
        this.filteredCandidates = []; 
      }
    });
  }
  
  openCandidateForm() {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      height: '80%',
      width: '600px',
      maxHeight: '90vh',
      data: { 
        clients: this.clients,
        viewMode: false
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCandidate(result.rq_id, result);
      }
    });
  }
  
  createCandidate(rq_id: string | null, candidate: Candidate): void {
    if (rq_id) {
      this.candidateService.createCandidate(rq_id, candidate).subscribe({
        next: (response) => {
          console.log('Candidate created successfully:', response);
          this.loadCandidates();
          this.snackBar.open('Candidate added successfully!', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error creating candidate:', err);
          this.snackBar.open('Error adding candidate. Please try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      console.error('Requirement ID is not selected.');
    }
  }

  viewCandidate(candidate: Candidate): void {
    this.candidateService.getCandidate(candidate.cd_id).subscribe({
      next: (fetchedCandidate) => {
        console.log('Fetched Candidate:', fetchedCandidate);
        const dialogRef = this.dialog.open(CandidateFormComponent, {
          height: '600px',
          width: '700px',
          data: { 
            candidate: fetchedCandidate,
            clients: this.clients,
            requirements: this.requirements,
            viewMode: true
          }
        });
      },
      error: (err) => {
        console.error('Error fetching candidate:', err);
      }
    });
  }

  editCandidate(candidate: Candidate): void {
    this.candidateService.getCandidate(candidate.cd_id).subscribe({
      next: (fetchedCandidate) => {
        console.log('Fetched Candidate for editing:', fetchedCandidate);
        const dialogRef = this.dialog.open(CandidateFormComponent, {
          height: '600px',
          width: '700px',
          data: { 
            candidate: fetchedCandidate,
            clients: this.clients,
            requirements: this.requirements,
            viewMode: false
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.candidateService.updateCandidate(candidate.cd_id, result).subscribe({
              next: (response) => {
                console.log('Updated Candidate Data:', response);
                this.loadCandidates();
                this.snackBar.open('Candidate updated successfully!', 'Close', { duration: 3000 });
              },
              error: (err) => {
                console.error('Error updating candidate:', err);
                this.snackBar.open('Error updating candidate. Please try again.', 'Close', { duration: 3000 });
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching candidate for editing:', err);
      }
    });
  }
  
  deleteCandidate(candidate: Candidate): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.candidateService.deleteCandidate(candidate.cd_id).subscribe({
                next: (response) => {
                    console.log('Deleted candidate:', response);
                    this.loadCandidates();
                    this.snackBar.open('Candidate deleted successfully!', 'Close', { duration: 3000 });
                },
                error: (err) => {
                    console.error('Error deleting candidate:', err);
                    this.snackBar.open('Error deleting candidate. Please try again.', 'Close', { duration: 3000 });
                }
            });
        } else {
            console.log('Candidate deletion was cancelled.');
        }
    });
  }

  onClientChange(): void {
    if (this.selectedClientId) {
      this.candidateService.getRequirements(this.selectedClientId).subscribe({
        next: (requirements: Requirement[]) => {
          this.requirements = requirements;

          // Clear candidates and filtered candidates if no requirements are found
          if (requirements.length === 0) {
            this.candidates = [];
            this.filteredCandidates = [];
            this.snackBar.open('No requirements found for this client.', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error loading requirements:', err);
          this.requirements = [];
        }
      });
    } else {
      this.requirements = [];
      this.candidates = [];
      this.filteredCandidates = []; // Clear candidates if no client is selected
    }
  }

  onRequirementChange(): void {
    if (this.selectedRequirementId) {
      this.candidateService.getCandidatesByRqId(this.selectedRequirementId).subscribe({
        next: (candidates: Candidate[]) => {
          this.candidates = candidates;
          this.filteredCandidates = candidates; // Update filtered candidates

          // Check if the candidates array is empty
          if (candidates.length === 0) {
            this.filteredCandidates = []; // Clear filtered candidates if none found
            console.warn('No candidates found for this requirement.'); // Optional: log a warning
          }
        },
        error: (err) => {
          console.error('Error loading candidates by requirement:', err);
          this.candidates = [];
          this.filteredCandidates = []; // Clear filtered candidates on error
        }
      });
    } else {
      this.candidates = [];
      this.filteredCandidates = []; // Clear filtered candidates if no requirement is selected
    }
  }
  
  filterCandidates(): void {
    this.filteredCandidates = this.candidates.filter(candidate =>
      candidate.cd_first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      candidate.cd_email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      candidate.cd_phno?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      candidate.cd_loc?.toLowerCase().includes(this.searchQuery.toLowerCase()) // Include location in filter
    );
  }  
}
