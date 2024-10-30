import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = '/api/jd_upload/clients'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to fetch clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Update to send client_name as a query parameter
  addClient(clientName: string): Observable<any> {
    // Create form data
    const formData = new FormData();
    formData.append('client_name', clientName); // Same key-value as in Postman

    // Make the POST request
    return this.http.post(this.apiUrl, formData)
    
  }
  
}