import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button mat-raised-button color="primary" *ngIf="actionText && actionRoute"
              [routerLink]="actionRoute">
        {{ actionText }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: #333;
    }

    p {
      font-size: 16px;
      color: #666;
      margin: 0 0 30px 0;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No items found';
  @Input() message = 'Get started by creating your first item';
  @Input() actionText = '';
  @Input() actionRoute = '';
}