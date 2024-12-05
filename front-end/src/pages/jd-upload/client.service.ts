import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsApiUrl = '/api/jd_upload/clients'; // API URL for clients
  

  constructor(private http: HttpClient) {}

  // Method to fetch clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.clientsApiUrl);
  }

}