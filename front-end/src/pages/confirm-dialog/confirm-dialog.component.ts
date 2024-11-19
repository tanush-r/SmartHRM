import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <mat-card class="confirm-dialog">
      <mat-card-header>
        <h1 mat-dialog-title>Confirm Deletion</h1>
      </mat-card-header>
      <mat-card-content>
        <p>Are you sure you want to delete this? This action cannot be undone.</p>
      </mat-card-content>
      <mat-card-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">Cancel</button>
        <button mat-raised-button 
                color="warn" 
                (click)="onConfirm()">
          Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  standalone: true,
  styleUrls: ['./confirm-dialog.component.css'], // Correctly reference the external CSS file
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
