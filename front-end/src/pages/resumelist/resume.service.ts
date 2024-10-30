import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private s3Link: string = '';

  setS3Link(link: string): void {
    this.s3Link = link;
  }

  getS3Link(): string {
    return this.s3Link;
  }
}
