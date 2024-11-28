import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ResumeStateService, Client, Position, Resume, Status } from './resumestate.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-resumelist',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet, SkeletonModule, ListboxModule, DropdownModule, MatSelectModule, MatIconModule],
  templateUrl: './resumelist.component.html',
  styleUrls: ['./resumelist.component.css']
})
export class ResumelistComponent implements OnInit {
  clients: Client[] = [];
  positions: Position[] = [];
  resumes: Resume[] = [];
  selectedClientId: string = '';
  selectedPosition: string = '';
  selectedPositionS3Link: string | null = null;
  isLoadingResumes: boolean = false;
  statusOptions: Status[] = []; // Store statuses

  constructor(
    private http: HttpClient,
    private router: Router,
    private resumeStateService: ResumeStateService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadStatuses(); // Load statuses on initialization
    this.restoreState();
  }

  private restoreState(): void {
    this.selectedClientId = this.resumeStateService.getSelectedClientId();
    this.selectedPosition = this.resumeStateService.getSelectedPosition();
    this.resumes = this.resumeStateService.getResumes();
    this.selectedPositionS3Link = this.resumeStateService.getPositionS3Link();

    if (this.selectedClientId) {
      this.loadPositions(this.selectedClientId);
    }

    if (this.selectedPosition) {
      this.fetchResumes();
    }
  }

  loadClients(): void {
    this.http.get<Client[]>('/api/viewer/clients').subscribe(
      (data: Client[]) => this.clients = data,
      (error) => this.handleError('Error fetching clients', error)
    );
  }

  loadStatuses(): void {
    this.http.get<Status[]>('/api/viewer/statuses').subscribe(
      (data: Status[]) => this.statusOptions = data,
      (error) => this.handleError('Error fetching statuses', error)
    );
  }

  onClientChange(): void {
    this.resumeStateService.setSelectedClientId(this.selectedClientId);
    if (this.selectedClientId) {
      this.loadPositions(this.selectedClientId);
    } else {
      this.positions = [];
      this.selectedPositionS3Link = null;
    }
  }

  loadPositions(clientId: string): void {
    this.http.get<Position[]>(`/api/viewer/positions?cl_id=${clientId}`).subscribe(
      (data: Position[]) => this.positions = data,
      (error) => this.handleError('Error fetching positions', error)
    );
  }

  fetchResumes(): void {
    if (this.selectedClientId && this.selectedPosition) {
      this.isLoadingResumes = true;
      this.http.get<Resume[]>(`/api/viewer/resumes?jd_id=${this.selectedPosition}`).subscribe(
        (data: Resume[]) => {
          this.resumes = data.map(resume => ({
            ...resume,
            st_name: this.getStatusName(resume.st_id) // Ensure status name is fetched
          }));
          this.resumeStateService.setResumes(this.resumes);
          this.isLoadingResumes = false;
        },
        (error) => {
          this.isLoadingResumes = false;
          this.handleError('Error fetching resumes', error);
        }
      );
    } else {
      this.snackBar.open('Please select a client and position.', 'Close', { duration: 3000 });
    }
  }

  getStatusName(st_id: string): string {
    const status = this.statusOptions.find(s => s.st_id === st_id);
    return status ? status.st_name : 'Unknown Status'; // Return the status name or a default
  }

  downloadResume(resume: Resume): void {
    if (resume.s3_link) {
      window.open(resume.s3_link, '_blank');
    } else {
      this.snackBar.open('No S3 link available for the selected resume.', 'Close', { duration: 3000 });
    }
  }

  viewResume(resume: Resume): void {
    if (resume.s3_link) {
      this.router.navigate(['/questioner'], {
        queryParams: {
          resumeS3Link: resume.s3_link,
          positionS3Link: this.selectedPositionS3Link,
          resumeId: resume.resume_id,
          jdId: resume.jd_id
        }
      });
    } else {
      this.snackBar.open('No S3 link available for the selected resume.', 'Close', { duration: 3000 });
    }
  }

  onPositionSelect(): void {
    const selectedPosition = this.positions.find(pos => pos.jd_id === this.selectedPosition);
    if (selectedPosition) {
      this.selectedPositionS3Link = selectedPosition.s3_link;
      this.resumeStateService.setPositionS3Link(this.selectedPositionS3Link);
    } else {
      console.error('Selected position not found');
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  updateStatus(resume: Resume): void {
    if (!resume.st_id) {
      this.snackBar.open('Status cannot be empty. Please select a status.', 'Close', { duration: 3000 });
      return;
    }
  
    const apiUrl = `/api/viewer/resumes/status/${resume.resume_id}?st_id=${resume.st_id}`;
    
    console.log('Updating status with URL:', apiUrl); // Log the URL for debugging
  
    this.http.post(apiUrl, {}).subscribe(
      (response) => {
        console.log('Status updated successfully:', response);
        this.snackBar.open('Status updated successfully.', 'Close', { duration: 3000 });
      },
      (error) => this.handleError('Error updating status', error)
    );
  }  
  
  sortResumes(order: 'asc' | 'desc'): void {
    this.resumes.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  onStatusChange(resume: Resume): void {
    this.updateStatus(resume);
  }
  
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(`${message}. Please try again later.`, 'Close', { duration: 3000 });
  }
}
