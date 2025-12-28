import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { Itinerary } from '../../../core/models/itinerary.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    NavbarComponent,
    LoaderComponent,
    EmptyStateComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container">
      <div class="header">
        <h1>My Travel Itineraries</h1>
        <button mat-raised-button color="primary" routerLink="/itineraries/new">
          <mat-icon>add</mat-icon>
          Create New Trip
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search destinations</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Where do you want to go?">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <app-loader [loading]="loading" message="Loading your itineraries..."></app-loader>

      <div class="itinerary-grid" *ngIf="!loading && (filteredItineraries$ | async) as itineraries">
        <app-empty-state 
          *ngIf="itineraries.length === 0"
          icon="explore"
          title="No itineraries yet"
          message="Start planning your next adventure by creating your first itinerary"
          actionText="Create Itinerary"
          actionRoute="/itineraries/new">
        </app-empty-state>

        <mat-card *ngFor="let itinerary of itineraries" class="itinerary-card">
          <div class="card-image" [style.background-image]="getDestinationImage(itinerary)">
            <div class="card-overlay">
              <h2>{{ itinerary.destination }}</h2>
            </div>
          </div>

          <mat-card-content>
            <div class="dates">
              <mat-icon>event</mat-icon>
              <span>{{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}</span>
            </div>

            <div class="info-row">
              <div class="info-item">
                <mat-icon>calendar_today</mat-icon>
                <span>{{ getDuration(itinerary) }} days</span>
              </div>
              <div class="info-item">
                <mat-icon>account_balance_wallet</mat-icon>
                <span>\${{ itinerary.totalEstimatedCost }}</span>
              </div>
            </div>

            <div class="preferences" *ngIf="itinerary.preferences.length > 0">
              <mat-chip *ngFor="let pref of itinerary.preferences.slice(0, 3)">
                {{ pref }}
              </mat-chip>
            </div>

            <div class="budget-status">
              <div class="budget-bar">
                <div class="budget-fill" 
                     [style.width.%]="getBudgetPercentage(itinerary)"
                     [class.over-budget]="itinerary.totalEstimatedCost > itinerary.budget">
                </div>
              </div>
              <span class="budget-text">
                \${{ itinerary.totalEstimatedCost }} / \${{ itinerary.budget }}
              </span>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="['/itineraries', itinerary.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            <button mat-button [routerLink]="['/itineraries', itinerary.id, 'edit']">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="deleteItinerary(itinerary.id)">
                <mat-icon color="warn">delete</mat-icon>
                Delete
              </button>
            </mat-menu>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 32px;
      margin: 0;
    }

    .filters {
      margin-bottom: 30px;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .itinerary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .itinerary-card {
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .itinerary-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      padding: 20px;
    }

    .card-overlay h2 {
      margin: 0;
      color: white;
      font-size: 24px;
    }

    mat-card-content {
      padding: 20px;
    }

    .dates {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin-bottom: 15px;
    }

    .info-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #666;
      font-size: 14px;
    }

    .info-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .preferences {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    mat-chip {
      font-size: 12px;
    }

    .budget-status {
      margin-top: 15px;
    }

    .budget-bar {
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .budget-fill {
      height: 100%;
      background: #4caf50;
      transition: width 0.3s;
    }

    .budget-fill.over-budget {
      background: #f44336;
    }

    .budget-text {
      font-size: 12px;
      color: #666;
    }

    mat-card-actions {
      padding: 0 16px 16px;
      display: flex;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .itinerary-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
    }
  `]
})
export class ItineraryListComponent implements OnInit {
  itineraries$!: Observable<Itinerary[]>;
  filteredItineraries$!: Observable<Itinerary[]>;
  searchControl = new FormControl('');
  loading = true;

  constructor(
    private itineraryService: ItineraryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.itineraries$ = this.itineraryService.getAll();

    setTimeout(() => this.loading = false, 1000);

    this.filteredItineraries$ = combineLatest([
      this.itineraries$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300)
      )
    ]).pipe(
      map(([itineraries, search]) => {
        if (!search) return itineraries;
        const term = search.toLowerCase();
        return itineraries.filter(i =>
          i.destination.toLowerCase().includes(term)
        );
      })
    );
  }

  deleteItinerary(id: string): void {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      this.itineraryService.delete(id).subscribe(() => {
        this.snackBar.open('Itinerary deleted successfully', 'Close', { duration: 3000 });
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getDuration(itinerary: Itinerary): number {
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  getBudgetPercentage(itinerary: Itinerary): number {
    return Math.min((itinerary.totalEstimatedCost / itinerary.budget) * 100, 100);
  }

  getDestinationImage(itinerary: Itinerary): string {
    // 1. Check for stored media (generated by backend/service)
    if (itinerary.media && itinerary.media.length > 0) {
      const url = itinerary.media[0];
      // Ensure proper CSS format
      return url.startsWith('url(') ? url : `url(${url})`;
    }

    // 2. Fallback to hardcoded list for specific cities
    const images: Record<string, string> = {
      'Paris': 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500)',
      'Tokyo': 'url(https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500)',
      'New York': 'url(https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500)',
      'London': 'url(https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500)',
      'Rome': 'url(https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500)'
    };

    if (images[itinerary.destination]) {
      return images[itinerary.destination];
    }

    // 3. Last resort dynamic image
    const safeDest = encodeURIComponent(itinerary.destination);
    return `url(https://loremflickr.com/800/600/${safeDest},travel/all)`;
  }
}