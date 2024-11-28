import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Question {
  question: string;
  answer: string;
}

export interface ResumeQuestionsResponse {
  questions_and_answers: Question[];
  client_id: string;
}

export interface JDQuestionsResponse {
  questions_and_answers: Question[];
  client_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = '/api/viewer';

  constructor(private http: HttpClient) {}

  getJDQuestions(count: number, jdId: string, clientId: string): Observable<JDQuestionsResponse> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('jd_id', jdId)
      .set('cl_id', clientId);

    return this.http.get<JDQuestionsResponse>(`${this.baseUrl}/qa_gen/jd`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching JD questions:', error);
          return of({ questions_and_answers: [], client_id: clientId });
        })
      );
  }

  getResumeQuestions(count: number, resumeId: string, clientId: string): Observable<ResumeQuestionsResponse> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('resume_id', resumeId)
      .set('cl_id', clientId);

    return this.http.get<ResumeQuestionsResponse>(`${this.baseUrl}/qa_gen/resume`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching Resume questions:', error);
          return of({ questions_and_answers: [], client_id: clientId });
        })
      );
  }

  getResume(resumeId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/resumes/download/${resumeId}`, { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error('Error downloading Resume:', error);
          return of(new Blob());
        })
      );
  }
}
