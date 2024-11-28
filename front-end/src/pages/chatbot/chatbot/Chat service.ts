import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  private apiUrl = 'http://your-backend-url/api/chatbot'; // URL to your backend API

  constructor(private http: HttpClient) {}

  // Sending the user input to the backend and getting the AI response
  getBotResponse(userInput: string): Observable<string> {
    const requestPayload = { message: userInput }; // Payload to send to the backend

    return this.http.post<string>(this.apiUrl, requestPayload);
  }
}