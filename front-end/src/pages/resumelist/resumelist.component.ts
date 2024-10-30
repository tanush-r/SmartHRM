import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ResumeStateService, Client, Position, Resume } from './resumestate.service'; // Adjust the import path
import { InputSwitchModule } from 'primeng/inputswitch';
import { Skeleton, SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-resumelist',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, RouterOutlet,InputSwitchModule,SkeletonModule,DropdownModule],
  templateUrl: './resumelist.component.html',
  styleUrls: ['./resumelist.component.css']
})
export class ResumelistComponent implements OnInit {
  clients: Client[] = [];
  positions: Position[] = [];
  selectedClientId: string = '';
  selectedPosition: string = '';
  resumes: Resume[] = [];
  selectedPositionS3Link: string | null = null; // Store selected position's s3_link
  isLoadingResumes: boolean = false; // Loader state for fetching resumes

  constructor(private http: HttpClient, private router: Router, private resumeStateService: ResumeStateService) {}

  ngOnInit(): void {
    this.loadClients(); // Load clients as soon as the component is initialized

    // Restore state if available
    this.selectedClientId = this.resumeStateService.getSelectedClientId();
    this.selectedPosition = this.resumeStateService.getSelectedPosition();
    this.resumes = this.resumeStateService.getResumes();
    this.selectedPositionS3Link = this.resumeStateService.getPositionS3Link(); // Retrieve position S3 link

    // Load positions if a client is already selected
    if (this.selectedClientId) {
      this.loadPositions(this.selectedClientId);
    }

    // Fetch resumes if a position is already selected
    if (this.selectedPosition) {
      this.fetchResumes();
    }
  }

  loadClients(): void {
    this.http.get<Client[]>('/api/viewer/clients').subscribe(
      (data: Client[]) => {
        this.clients = data; // Store the fetched clients
      },
      (error) => {
        console.error('Error fetching clients:', error);
        alert('Failed to load clients. Please try again later.');
      }
    );
  }

  onClientChange(): void {
    this.resumeStateService.setSelectedClientId(this.selectedClientId); // Store selected client ID
    if (this.selectedClientId) {
      this.loadPositions(this.selectedClientId); // Load positions when a client is selected
    } else {
      this.positions = []; // Clear positions if no client is selected
      this.selectedPositionS3Link = null; // Clear S3 link if no client
    }
  }

  loadPositions(clientId: string): void {
    this.http.get<Position[]>(`/api/viewer/positions?client_id=${clientId}`).subscribe(
      (data: Position[]) => {
        this.positions = data; // Store the fetched positions
      },
      (error) => {
        console.error('Error fetching positions:', error);
        this.positions = []; // Clear positions on error
        alert('Failed to load positions. Please try again later.');
      }
    );
  }

  fetchResumes(): void {
    if (this.selectedClientId && this.selectedPosition) {
      this.isLoadingResumes = true; // Start loading
      this.http.get<Resume[]>(`/api/viewer/resumes?jd_id=${this.selectedPosition}`).subscribe(
        (data: Resume[]) => {
          this.resumes = data.map(resume => ({
            ...resume,
            eligible: resume.status === 'Eligible',
            notEligible: resume.status === 'Not Eligible',
            onboarded: resume.status === 'Onboarded'
          })); // Map the fetched resumes to include the status fields
          this.resumeStateService.setResumes(this.resumes); // Store resumes in the service
          this.isLoadingResumes = false; // Stop loading
        },
        (error) => {
          console.error('Error fetching resumes:', error);
          this.resumes = []; // Clear resumes on error
          this.isLoadingResumes = false; // Stop loading
          alert('Failed to load resumes. Please try again later.');
        }
      );
    } else {
      alert('Please select a client and position.'); // Alert if selections are missing
    }
  }

  downloadResume(s3_link: string): void {
    if (s3_link) {
      window.open(s3_link, '_blank'); // Open the S3 link in a new tab
    } else {
      alert('No S3 link available for the selected resume.'); // Alert if no link
    }
  }

  viewResume(resume: Resume): void {
    if (resume.s3_link) {
      this.router.navigate(['/questioner'], {
        queryParams: {
          resumeS3Link: resume.s3_link,
          positionS3Link: this.selectedPositionS3Link,
          resumeId: resume.resume_id, // Pass resume_id
          jdId: resume.jd_id // Pass jd_id
        }
      }); // Navigate to questioner component with parameters
    } else {
      alert('No S3 link available for the selected resume.'); // Alert if links are missing
    }
  }

  onPositionSelect(): void {
    const selectedPosition = this.positions.find(pos => pos.jd_id === this.selectedPosition);
    if (selectedPosition) {
      this.selectedPositionS3Link = selectedPosition.s3_link; // Store the selected position's s3_link
      this.resumeStateService.setPositionS3Link(this.selectedPositionS3Link); // Store in state service
    } else {
      console.error('Selected position not found'); // Log error if not found
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Format date to local string
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time to local string
  }

  updateStatus(resumeId: string, statusType: 'eligible' | 'notEligible' | 'onboarded', value: boolean): void {
    const apiUrl = `/api/viewer/resumes/status/${resumeId}?status=${statusType === 'eligible' ? (value ? 'Eligible' : 'Not Eligible') :
                statusType === 'notEligible' ? (value ? 'Not Eligible' : 'Eligible') :
                statusType === 'onboarded' ? (value ? 'Onboarded' : 'Not Onboarded') : ''}`;
  
    this.http.post(apiUrl, {}).subscribe( // Send an empty body since the status is in the URL
      (response) => {
        console.log('Status updated successfully:', response);
        alert('Status updated successfully.');
        // Optionally, refresh the resumes or update local state as necessary
        this.fetchResumes(); // Refresh resumes after updating status
      },
      (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again later.');
      }
    );
  }

  sortResumes(order: 'asc' | 'desc'): void {
    this.resumes.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
  
      if (order === 'asc') {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });
  }
  onEligibleChange(resume: any) {
    if (resume.eligible) {
      resume.notEligible = false;
      resume.onboarded = false;
    }
    this.updateStatus(resume.resume_id, 'eligible', resume.eligible);
  }
  
  onNotEligibleChange(resume: any) {
    if (resume.notEligible) {
      resume.eligible = false;
      resume.onboarded = false;
    }
    this.updateStatus(resume.resume_id, 'notEligible', resume.notEligible);
  }
  
  onOnboardedChange(resume: any) {
    if (resume.onboarded) {
      resume.eligible = false;
      resume.notEligible = false;
    }
    this.updateStatus(resume.resume_id, 'onboarded', resume.onboarded);
  }
  
}
