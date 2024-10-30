import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsApiUrl = '/api/resume_upload/clients'; // Update this to your actual endpoint
  private positionsApiUrl = '/api/resume_upload/positions'; // Update this to your actual endpoint

  constructor(private http: HttpClient) {}

  // Method to fetch all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.clientsApiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Method to fetch positions for a specific client by name
  getPositions(clientName: string): Observable<any[]> {
    const params = new HttpParams().set('client_name', clientName);
    return this.http.get<any[]>(this.positionsApiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Basic error handling function
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
