import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalClients: number = 0;
  totalResumes: number = 0;
  totalJDs: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSummaryCounts();
  }

  fetchSummaryCounts(): void {
    this.http.get<{ total_clients: number; total_resumes: number; total_jds: number }>('http://localhost:8000/summary/counts')
      .subscribe(
        (data) => {
          this.totalClients = data.total_clients;
          this.totalResumes = data.total_resumes;
          this.totalJDs = data.total_jds;
        },
        (error) => {
          console.error('Error fetching summary counts:', error);
        }
      );
  }
}
