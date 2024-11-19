// client.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientWithContacts } from './client.model'; // Import the client model

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private apiUrl = 'http://localhost:8001/clients'; // FastAPI URL

  constructor(private http: HttpClient) {}

  // Fetch all clients
  getClients(): Observable<ClientWithContacts[]> {
    return this.http.get<ClientWithContacts[]>(this.apiUrl);
  }

  // Fetch a client by ID
  getClientById(clientId: string): Observable<ClientWithContacts> {
    return this.http.get<ClientWithContacts>(`${this.apiUrl}/${clientId}`);
  }

  // Create a new client
  createClient(client: ClientWithContacts): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  // Update a client
  updateClient(clientId: string, client: ClientWithContacts): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clientId}`, client);
  }

  // Delete a client
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${clientId}`);
  }
}
