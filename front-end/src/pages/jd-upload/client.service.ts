import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/clients'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to fetch clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Update to send client_name as a query parameter
  addClient(clientName: string): Observable<any> {
    const params = new HttpParams().set('client_name', clientName);
    return this.http.post(this.apiUrl, null, { params });
  }
  
}