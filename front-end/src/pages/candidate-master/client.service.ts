import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client, Candidate, Requirement } from './candidate.model'; // Import necessary models

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:8004'; // Ensure this is your backend API URL

  constructor(private http: HttpClient) { }

  // Handle errors from HTTP requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`).pipe(
      catchError(this.handleError)
    );
  }

  getRequirements(clientId: string): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(`${this.apiUrl}/requirements/${clientId}`).pipe(
      catchError(this.handleError)
    );
  }

  createCandidate(rq_id: string, candidate: Candidate): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidates/${rq_id}`, candidate).pipe(
      catchError(this.handleError)
    );
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`).pipe(
      catchError(this.handleError)
    );
  }

  getCandidatesByRqId(rq_id: string): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates/requirement/${rq_id}`).pipe(
      catchError(this.handleError)
    );
  }  

  getCandidate(cd_id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/candidates/${cd_id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCandidate(cd_id: string, candidate: Candidate): Observable<any> {
    return this.http.put(`${this.apiUrl}/candidates/${cd_id}`, candidate).pipe(
      catchError(this.handleError)
    );
  }

  deleteCandidate(cd_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/candidates/${cd_id}`).pipe(
      catchError(this.handleError)
    );
  }
}
