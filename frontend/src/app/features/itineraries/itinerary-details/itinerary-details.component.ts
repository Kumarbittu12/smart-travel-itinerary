import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { Itinerary, DayPlan, Activity } from '../../../core/models/itinerary.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-itinerary-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    LoaderComponent
  ],
  template: `


    
    <div class="container">
      <app-loader [loading]="loading" message="Loading itinerary..."></app-loader>

      <div *ngIf="!loading && itinerary" class="details-wrapper">
        <!-- Header Section -->
        <mat-card class="header-card">
          <div class="header-content">
            <div class="header-left">
              <h1>{{ itinerary.destination }}</h1>
              <div class="meta-info">
                <div class="meta-item">
                  <mat-icon>event</mat-icon>
                  <span>{{ formatDate(itinerary.startDate) }} - {{ formatDate(itinerary.endDate) }}</span>
                </div>
                <div class="meta-item">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ getDuration(itinerary) }} days</span>
                </div>
              </div>
              <div class="preferences">
                <mat-chip *ngFor="let pref of itinerary.preferences">{{ pref }}</mat-chip>
              </div>
            </div>
            <div class="header-actions">
              <button mat-raised-button color="primary" 
                      [routerLink]="['/itineraries', itinerary.id, 'edit']">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button (click)="shareItinerary()">
                <mat-icon>share</mat-icon>
                Share
              </button>
              <button mat-button (click)="exportItinerary()">
                <mat-icon>download</mat-icon>
                Export
              </button>
            </div>
          </div>

          <!-- Budget Overview -->
          <div class="budget-overview">
            <div class="budget-card">
              <mat-icon>account_balance_wallet</mat-icon>
              <div>
                <span class="label">Total Budget</span>
                <span class="value">\${{ itinerary.budget }}</span>
              </div>
            </div>
            <div class="budget-card">
              <mat-icon>receipt</mat-icon>
              <div>
                <span class="label">Estimated Cost</span>
                <span class="value">\${{ itinerary.totalEstimatedCost }}</span>
              </div>
            </div>
            <div class="budget-card">
              <mat-icon>savings</mat-icon>
              <div>
                <span class="label">Remaining</span>
                <span class="value" [class.negative]="getRemaining(itinerary) < 0">
                  \${{ getRemaining(itinerary) }}
                </span>
              </div>
            </div>
            <div class="budget-card">
              <mat-icon>percent</mat-icon>
              <div>
                <span class="label">Budget Used</span>
                <span class="value">{{ getBudgetPercentage(itinerary) }}%</span>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Main Content Tabs -->
        <mat-tab-group class="content-tabs" animationDuration="300ms">
          <!-- Day Plans Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>today</mat-icon>
              Day Plans
            </ng-template>
            
            <div class="tab-content">
              <mat-accordion multi>
                <mat-expansion-panel *ngFor="let day of itinerary.dayPlans" [expanded]="true">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <strong>Day {{ day.day }}</strong>
                      <span class="day-date">{{ formatDate(day.date) }}</span>
                    </mat-panel-title>
                    <mat-panel-description>
                      {{ day.activities.length }} activities • \${{ day.totalCost }}
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="day-content">
                    <div class="activity" *ngFor="let activity of day.activities; let last = last">
                      <div class="activity-time">
                        <mat-icon>schedule</mat-icon>
                        <span>{{ activity.startTime }}</span>
                      </div>
                      <div class="activity-details">
                        <div class="activity-header">
                          <h4>{{ activity.name }}</h4>
                          <mat-chip class="activity-type">{{ activity.type }}</mat-chip>
                        </div>
                        <div class="activity-info">
                          <span><mat-icon>location_on</mat-icon> {{ activity.location }}</span>
                          <span><mat-icon>timer</mat-icon> {{ activity.duration }} min</span>
                          <span><mat-icon>attach_money</mat-icon> {{ activity.estimatedCost }}</span>
                        </div>
                        <p class="activity-notes" *ngIf="activity.notes">
                          <mat-icon>notes</mat-icon>
                          {{ activity.notes }}
                        </p>
                      </div>
                    </div>

                    <div class="day-summary">
                      <div class="summary-item">
                        <mat-icon>directions_car</mat-icon>
                        <span>Travel Time: {{ day.travelTime }} min</span>
                      </div>
                      <div class="summary-item">
                        <mat-icon>attach_money</mat-icon>
                        <span>Daily Total: \${{ day.totalCost }}</span>
                      </div>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </mat-tab>

          <!-- Budget Breakdown Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>pie_chart</mat-icon>
              Budget
            </ng-template>
            
            <div class="tab-content">
              <mat-card class="budget-breakdown">
                <h3>Daily Breakdown</h3>
                <div class="breakdown-list">
                  <div class="breakdown-item" *ngFor="let day of itinerary.dayPlans">
                    <div class="breakdown-label">
                      <strong>Day {{ day.day }}</strong>
                      <span>{{ formatDate(day.date) }}</span>
                    </div>
                    <div class="breakdown-bar">
                      <div class="bar-fill" 
                           [style.width.%]="(day.totalCost / itinerary.budget) * 100">
                      </div>
                    </div>
                    <span class="breakdown-value">\${{ day.totalCost }}</span>
                  </div>
                </div>

                <div class="total-row">
                  <strong>Total Estimated Cost</strong>
                  <strong class="total-amount">\${{ itinerary.totalEstimatedCost }}</strong>
                </div>

                <div class="budget-status" 
                     [class.over-budget]="itinerary.totalEstimatedCost > itinerary.budget">
                  <mat-icon>{{ itinerary.totalEstimatedCost > itinerary.budget ? 'error' : 'check_circle' }}</mat-icon>
                  <span>
                    {{ itinerary.totalEstimatedCost > itinerary.budget ? 
                       'Over budget by  + (itinerary.totalEstimatedCost - itinerary.budget) :
                       'Within budget' }}
                  </span>
                </div>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Notes Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>note</mat-icon>
              Notes
            </ng-template>
            
            <div class="tab-content">
              <mat-card>
                <h3>Travel Notes</h3>
                <p *ngIf="itinerary.notes" class="notes-content">{{ itinerary.notes }}</p>
                <p *ngIf="!itinerary.notes" class="empty-notes">
                  <mat-icon>edit_note</mat-icon>
                  No notes added yet. Click edit to add your travel notes.
                </p>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    .details-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .header-card {
      padding: 30px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 36px;
      margin: 0 0 15px 0;
      color: #333;
    }

    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 15px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .preferences {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .budget-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .budget-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .budget-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .budget-card .label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .budget-card .value {
      display: block;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .budget-card .value.negative {
      color: #f44336;
    }

    .content-tabs {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    mat-accordion {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .day-date {
      margin-left: 10px;
      color: #666;
      font-weight: normal;
    }

    .day-content {
      padding: 20px 0;
    }

    .activity {
      display: flex;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }

    .activity:last-child {
      border-bottom: none;
    }

    .activity-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      min-width: 80px;
      color: #667eea;
      font-weight: 600;
    }

    .activity-details {
      flex: 1;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .activity-header h4 {
      margin: 0;
      font-size: 18px;
    }

    .activity-type {
      font-size: 12px;
    }

    .activity-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 10px;
    }

    .activity-info span {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      color: #666;
    }

    .activity-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .activity-notes {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .activity-notes mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .day-summary {
      display: flex;
      gap: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 15px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .budget-breakdown {
      padding: 30px;
    }

    .budget-breakdown h3 {
      margin: 0 0 20px 0;
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 30px;
    }

    .breakdown-item {
      display: grid;
      grid-template-columns: 150px 1fr 100px;
      gap: 20px;
      align-items: center;
    }

    .breakdown-label strong {
      display: block;
      margin-bottom: 2px;
    }

    .breakdown-label span {
      font-size: 12px;
      color: #666;
    }

    .breakdown-bar {
      height: 24px;
      background: #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s;
    }

    .breakdown-value {
      text-align: right;
      font-weight: 600;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      border-top: 2px solid #333;
      font-size: 18px;
    }

    .total-amount {
      color: #667eea;
    }

    .budget-status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: #e8f5e9;
      border-radius: 8px;
      margin-top: 20px;
    }

    .budget-status mat-icon {
      color: #4caf50;
    }

    .budget-status.over-budget {
      background: #ffebee;
    }

    .budget-status.over-budget mat-icon {
      color: #f44336;
    }

    .notes-content {
      line-height: 1.6;
      color: #666;
      white-space: pre-wrap;
    }

    .empty-notes {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 40px;
      color: #999;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .budget-overview {
        grid-template-columns: 1fr;
      }

      .activity {
        flex-direction: column;
        gap: 10px;
      }

      .breakdown-item {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
  `]
})
export class ItineraryDetailsComponent implements OnInit {
  itinerary: Itinerary | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itineraryService: ItineraryService,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itineraryService.getById(id).subscribe(itinerary => {
        this.itinerary = itinerary || null;
        this.loading = false;
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
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getRemaining(itinerary: Itinerary): number {
    return itinerary.budget - itinerary.totalEstimatedCost;
  }

  getBudgetPercentage(itinerary: Itinerary): number {
    return Math.round((itinerary.totalEstimatedCost / itinerary.budget) * 100);
  }

  shareItinerary(): void {
    const url = window.location.href;
    this.clipboard.copy(url);
    this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 3000 });
  }

  exportItinerary(): void {
    const data = JSON.stringify(this.itinerary, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `itinerary-${this.itinerary?.destination}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('Itinerary exported!', 'Close', { duration: 3000 });
  }
}