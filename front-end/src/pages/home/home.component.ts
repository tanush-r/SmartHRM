import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from '../chatbot/chatbot/chatbot.component';
import { ApiService, DashboardMetrics, PositionMetrics } from './api.service'; // Adjust the import path
import { AuthService } from '../../services/auth.service'; // Adjust the import path
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Variables
  prompt: string = '';
  selectedTabFirstCard: string = 'all';
  selectedTabSecondCard: string = 'all';
  userEmail: string | null = ''; // Declare userEmail property

  // Data for Master section cards
  clientCount = 0;
  requirementCount = 0;
  candidateCount = 0;

  // Data for Status section cards
  openPositions = 0;
  closedPositions = 0;
  onHoldPositions = 0;

  private emailSubscription: Subscription | null = null; // Initialize with null

  constructor(private apiService: ApiService, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics(this.selectedTabFirstCard);
    this.loadPositionMetrics(this.selectedTabSecondCard);
    
    // Subscribe to get user's email
    this.emailSubscription = this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email; // Set userEmail to the retrieved email
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
  }

  selectTab(selectedFilter: string, card: string): void {
    const periodMap: { [key: string]: string } = {
      'today': 'today',
      'this week': 'this week',
      'this month': 'this month',
      'all': 'all'
    };

    const period = periodMap[selectedFilter] || selectedFilter; 

    if (card === 'first') {
      this.selectedTabFirstCard = selectedFilter;
      this.loadDashboardMetrics(period);
    } else if (card === 'second') {
      this.selectedTabSecondCard = selectedFilter;
      this.loadPositionMetrics(period);
    }
  }

  private loadDashboardMetrics(period: string): void {
    this.apiService.getDashboardMetrics(period).subscribe(
      (data: DashboardMetrics) => {
        this.clientCount = data.total_clients;
        this.requirementCount = data.total_requirements;
        this.candidateCount = data.total_resumes;
      },
      (error: any) => {
        console.error('Error fetching dashboard metrics', error);
      }
    );
  }

  private loadPositionMetrics(period: string): void {
    this.apiService.getPositionMetrics(period).subscribe(
      (data: PositionMetrics) => {
        this.openPositions = data.total_open_positions;
        this.closedPositions = data.total_closed_positions;
        this.onHoldPositions = data.on_hold;
      },
      (error: any) => {
        console.error('Error fetching position metrics', error);
      }
    );
  }

  openChatbot(): void {
    this.dialog.open(ChatbotComponent, {
      height: '600px',
      width: '900px',
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'custom-chatbot-dialog',
      data: { prompt: this.prompt }, // Pass the prompt to the chatbot component
    });
    this.prompt = ''; // Clear the prompt after opening the chatbot
  }
}
