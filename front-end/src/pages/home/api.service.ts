import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define the Client interface
export interface Client {
  cl_id: string;   // ID of the client
  cl_name: string; // Name of the client
}

// Define the Dashboard Metrics interface
export interface DashboardMetrics {
  total_clients: number;
  total_requirements: number;
  total_resumes: number;
}

// Define the Position Metrics interface
export interface PositionMetrics {
  total_open_positions: number;
  total_closed_positions: number;
  on_hold: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/'; // Set your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch the list of clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch dashboard metrics
  getDashboardMetrics(period: string): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/metrics/dashboard`, { params: { period } }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch position status metrics
  getPositionMetrics(period: string): Observable<PositionMetrics> {
    return this.http.get<PositionMetrics>(`${this.apiUrl}/metrics/positions`, { params: { period } }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
