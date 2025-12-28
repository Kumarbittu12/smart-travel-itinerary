import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { ActivityType } from '../../../core/models/itinerary.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-itinerary-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatStepperModule,
    MatSnackBarModule,
    NavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>add_location</mat-icon>
            Create New Itinerary
          </mat-card-title>
          <mat-card-subtitle>Plan your perfect trip in a few easy steps</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Basic Info -->
            <mat-step [stepControl]="basicInfoForm">
              <form [formGroup]="basicInfoForm">
                <ng-template matStepLabel>Basic Information</ng-template>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Destination</mat-label>
                  <input matInput formControlName="destination" placeholder="e.g., Paris, Tokyo, New York">
                  <mat-icon matPrefix>place</mat-icon>
                  <mat-error>Destination is required</mat-error>
                </mat-form-field>

                <div class="date-row">
                  <mat-form-field appearance="outline" class="flex-field">
                    <mat-label>Start Date</mat-label>
                    <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                    <mat-datepicker-toggle matPrefix [for]="startPicker"></mat-datepicker-toggle>
                    <mat-datepicker #startPicker></mat-datepicker>
                    <mat-error>Start date is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="flex-field">
                    <mat-label>End Date</mat-label>
                    <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                    <mat-datepicker-toggle matPrefix [for]="endPicker"></mat-datepicker-toggle>
                    <mat-datepicker #endPicker></mat-datepicker>
                    <mat-error>End date is required</mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Budget (USD)</mat-label>
                  <input matInput type="number" formControlName="budget" placeholder="e.g., 2000">
                  <mat-icon matPrefix>attach_money</mat-icon>
                  <mat-error *ngIf="basicInfoForm.get('budget')?.hasError('required')">
                    Budget is required
                  </mat-error>
                  <mat-error *ngIf="basicInfoForm.get('budget')?.hasError('min')">
                    Budget must be greater than 0
                  </mat-error>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext
                          [disabled]="basicInfoForm.invalid">
                    Next <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Preferences -->
            <mat-step [stepControl]="preferencesForm">
              <form [formGroup]="preferencesForm">
                <ng-template matStepLabel>Travel Preferences</ng-template>
                
                <div class="preferences-section">
                  <h3>What kind of activities do you enjoy?</h3>
                  <p class="hint">Select all that apply</p>
                  
                  <div class="preference-chips">
                    <mat-chip-listbox formControlName="preferences" multiple>
                      <mat-chip-option [value]="ActivityType.SIGHTSEEING">
                        <mat-icon>camera_alt</mat-icon> Sightseeing
                      </mat-chip-option>
                      <mat-chip-option [value]="ActivityType.ADVENTURE">
                        <mat-icon>terrain</mat-icon> Adventure
                      </mat-chip-option>
                      <mat-chip-option [value]="ActivityType.RELAXATION">
                        <mat-icon>spa</mat-icon> Relaxation
                      </mat-chip-option>
                      <mat-chip-option [value]="ActivityType.DINING">
                        <mat-icon>restaurant</mat-icon> Dining
                      </mat-chip-option>
                      <mat-chip-option [value]="ActivityType.SHOPPING">
                        <mat-icon>shopping_bag</mat-icon> Shopping
                      </mat-chip-option>
                    </mat-chip-listbox>
                  </div>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Additional Notes (Optional)</mat-label>
                  <textarea matInput formControlName="notes" rows="4"
                            placeholder="Any special requirements or notes..."></textarea>
                  <mat-icon matPrefix>notes</mat-icon>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon> Back
                  </button>
                  <button mat-raised-button color="primary" matStepperNext>
                    Next <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 3: Review & Create -->
            <mat-step>
              <ng-template matStepLabel>Review & Create</ng-template>
              
              <div class="review-section">
                <h3>Review Your Itinerary</h3>
                
                <div class="review-item">
                  <mat-icon>place</mat-icon>
                  <div>
                    <strong>Destination</strong>
                    <p>{{ basicInfoForm.get('destination')?.value }}</p>
                  </div>
                </div>

                <div class="review-item">
                  <mat-icon>event</mat-icon>
                  <div>
                    <strong>Dates</strong>
                    <p>{{ formatDate(basicInfoForm.get('startDate')?.value) }} - 
                       {{ formatDate(basicInfoForm.get('endDate')?.value) }}</p>
                  </div>
                </div>

                <div class="review-item">
                  <mat-icon>attach_money</mat-icon>
                  <div>
                    <strong>Budget</strong>
                    <p>\${{ basicInfoForm.get('budget')?.value }}</p>
                  </div>
                </div>

                <div class="review-item" *ngIf="preferencesForm.get('preferences')?.value?.length > 0">
                  <mat-icon>favorite</mat-icon>
                  <div>
                    <strong>Preferences</strong>
                    <div class="review-chips">
                      <mat-chip *ngFor="let pref of preferencesForm.get('preferences')?.value">
                        {{ pref }}
                      </mat-chip>
                    </div>
                  </div>
                </div>

                <div class="review-item" *ngIf="preferencesForm.get('notes')?.value">
                  <mat-icon>notes</mat-icon>
                  <div>
                    <strong>Notes</strong>
                    <p>{{ preferencesForm.get('notes')?.value }}</p>
                  </div>
                </div>

                <div class="info-box">
                  <mat-icon>info</mat-icon>
                  <p>We'll automatically generate a day-by-day itinerary based on your preferences. 
                     You can customize it after creation!</p>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button mat-raised-button color="primary" (click)="createItinerary()"
                        [disabled]="loading">
                  <mat-icon>check_circle</mat-icon> 
                  {{ loading ? 'Creating...' : 'Create Itinerary' }}
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 30px auto;
      padding: 0 20px;
    }

    mat-card {
      padding: 20px;
    }

    mat-card-header {
      margin-bottom: 30px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .date-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .flex-field {
      width: 100%;
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }

    .preferences-section {
      margin-bottom: 30px;
    }

    .preferences-section h3 {
      margin: 0 0 5px 0;
      font-size: 18px;
    }

    .hint {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .preference-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    mat-chip-option {
      cursor: pointer;
    }

    mat-chip-option mat-icon {
      margin-right: 5px;
    }

    .review-section {
      padding: 20px 0;
    }

    .review-section h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
    }

    .review-item {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .review-item mat-icon {
      color: #667eea;
      margin-top: 2px;
    }

    .review-item strong {
      display: block;
      margin-bottom: 5px;
      color: #333;
    }

    .review-item p {
      margin: 0;
      color: #666;
    }

    .review-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }

    .info-box {
      display: flex;
      gap: 15px;
      background: #e3f2fd;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .info-box mat-icon {
      color: #2196f3;
    }

    .info-box p {
      margin: 0;
      color: #1976d2;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .date-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ItineraryCreateComponent implements OnInit {
  basicInfoForm!: FormGroup;
  preferencesForm!: FormGroup;
  loading = false;
  ActivityType = ActivityType;

  constructor(
    private fb: FormBuilder,
    private itineraryService: ItineraryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.basicInfoForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: [today, Validators.required],
      endDate: [tomorrow, Validators.required],
      budget: [1000, [Validators.required, Validators.min(1)]]
    });

    this.preferencesForm = this.fb.group({
      preferences: [[]],
      notes: ['']
    });
  }

  createItinerary(): void {
    if (this.basicInfoForm.valid) {
      this.loading = true;

      const itineraryData = {
        ...this.basicInfoForm.value,
        ...this.preferencesForm.value
      };

      this.itineraryService.create(itineraryData).subscribe({
        next: (itinerary) => {
          this.loading = false;
          this.snackBar.open('Itinerary created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/itineraries', itinerary.id]);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Failed to create itinerary', 'Close', { duration: 3000 });
        }
      });
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}