import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Requirement, Client } from './requirement.model'; // Import both Requirement and Client

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private apiUrl = 'http://localhost:8002'; // Ensure this matches your FastAPI base URL

  constructor(private http: HttpClient) {}

  // Fetch all requirements
  getRequirements(): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(`${this.apiUrl}/requirements`);
  }

  createRequirement(clientId: string, requirement: Omit<Requirement, 'id'>): Observable<{ message: string; requirement_id: string }> {
    return this.http.post<{ message: string; requirement_id: string }>(
      `${this.apiUrl}/requirements/${clientId}`,
      requirement
    );
  }
  

// Update an existing requirement by ID
updateRequirement(id: string, requirement: Requirement): Observable<{ message: string; requirement_id: string }> {
  return this.http.put<{ message: string; requirement_id: string }>(`${this.apiUrl}/requirements/${id}`, requirement);
}


  // Delete a requirement by ID
  deleteRequirement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/requirements/${id}`);
  }

  // Get all clients from the backend for dropdown or selection
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  // Get requirements associated with a specific client ID
  getRequirementsByClient(clientId: string): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(`${this.apiUrl}/requirements/${clientId}`); // This should match the backend route
  }

  // Get a specific requirement by its ID
  getRequirementById(id: string): Observable<Requirement> {
    return this.http.get<Requirement>(`${this.apiUrl}/requirements/rq_id/${id}`); // Ensure this matches the backend route
  }
}
