import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container">
      <mat-card class="error-card">
        <mat-icon class="error-icon">block</mat-icon>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="hint">This page is restricted to admin users only.</p>
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/itineraries">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
          <button mat-button routerLink="/login">
            Login with Different Account
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .error-card {
      max-width: 500px;
      text-align: center;
      padding: 40px;
    }

    .error-icon {
      font-size: 100px;
      width: 100px;
      height: 100px;
      color: #f44336;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 15px;
      color: #333;
    }

    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }

    .hint {
      font-size: 14px;
      font-style: italic;
    }

    .actions {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class NotAuthorizedComponent {}