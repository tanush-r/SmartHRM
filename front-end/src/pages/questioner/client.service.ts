import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

export interface Question {
  question: string;
  answer: string;
}

export interface JDQuestionsResponse {
  questions_and_answers: Question[];
  client_id: string;
}

export interface ResumeQuestionsResponse {
  questions_and_answers: Question[];
  client_id: string;
}

export interface Status {
  st_id: string;
  st_name: string;
}

export interface PrimaryDetail {
  name: string;
  email: string;
  phone: string; // Ensure this matches the backend response
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/api/viewer'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  // Fetch JD Questions
  getJDQuestions(count: number, jdId: string, clientId: string): Observable<JDQuestionsResponse> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('jd_id', jdId)
      .set('cl_id', clientId);
  
    return this.http.get<JDQuestionsResponse>(`${this.baseUrl}/qa_gen/jd`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching JD questions:', error);
        // Handle the error and return a safe default object
        return of({ questions_and_answers: [], client_id: clientId });
      })
    );
  }

  // Fetch Resume Questions
  getResumeQuestions(count: number, resumeId: string, clientId: string): Observable<ResumeQuestionsResponse> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('resume_id', resumeId)
      .set('cl_id', clientId);

    return this.http.get<ResumeQuestionsResponse>(`${this.baseUrl}/qa_gen/resume`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching Resume questions:', error);
        return of({ questions_and_answers: [], client_id: clientId });
      })
    );
  }

  // Fetch Primary Details
  getPrimaryDetails(resumeId: string): Observable<PrimaryDetail> {
    return this.http.get<PrimaryDetail>(`${this.baseUrl}/primary?resume_id=${resumeId}`).pipe(
      catchError(error => {
        console.error('Error fetching primary details:', error);
        // Return an empty primary detail if there's an error
        return of({ name: '', email: '', phone: '' });
      })
    );
  }

  // Fetch Resume Status
  getResumeStatus(resumeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumes/status/${resumeId}`).pipe(
      catchError(error => {
        console.error('Error fetching resume status:', error);
        return of(null); // Return null on error
      })
    );
  }

  // Fetch Statuses
  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.baseUrl}/statuses`).pipe(
      catchError(error => {
        console.error('Error fetching statuses:', error);
        return of([]); // Return an empty array
      })
    );
  }

  // Update Resume Status
  updateResumeStatus(resumeId: string, statusId: string): Observable<any> {
    const params = new HttpParams().set('st_id', statusId); // Set st_id as a query parameter
    return this.http.post(`${this.baseUrl}/resumes/status/${resumeId}`, {}, { params }).pipe(
      catchError(error => {
        console.error('Error updating resume status:', error);
        return of(null); // Return null on error
      })
    );
  }
}
