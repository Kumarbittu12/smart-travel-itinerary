import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItineraryService } from '../../../core/services/itinerary.service';
import { Itinerary, ActivityType } from '../../../core/models/itinerary.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-itinerary-edit',
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
    MatSnackBarModule,
    NavbarComponent,
    LoaderComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container">
      <app-loader [loading]="loading" message="Loading itinerary..."></app-loader>

      <mat-card *ngIf="!loading && editForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>edit</mat-icon>
            Edit Itinerary
          </mat-card-title>
          <mat-card-subtitle>Update your travel plans</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="editForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Destination</mat-label>
              <input matInput formControlName="destination">
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
              <input matInput type="number" formControlName="budget">
              <mat-icon matPrefix>attach_money</mat-icon>
              <mat-error>Budget is required and must be greater than 0</mat-error>
            </mat-form-field>

            <div class="preferences-section">
              <label>Travel Preferences</label>
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

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="6"
                        placeholder="Add your travel notes..."></textarea>
              <mat-icon matPrefix>notes</mat-icon>
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button (click)="cancel()">
            <mat-icon>close</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" (click)="save()"
                  [disabled]="saving || editForm.invalid">
            <mat-icon>save</mat-icon>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </mat-card-actions>
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

    .preferences-section {
      margin-bottom: 20px;
    }

    .preferences-section label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    mat-chip-listbox {
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

    mat-card-actions {
      padding: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .date-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ItineraryEditComponent implements OnInit {
  editForm!: FormGroup;
  itineraryId!: string;
  loading = true;
  saving = false;
  ActivityType = ActivityType;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itineraryService: ItineraryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.itineraryId = this.route.snapshot.paramMap.get('id')!;
    
    this.itineraryService.getById(this.itineraryId).subscribe(itinerary => {
      if (itinerary) {
        this.editForm = this.fb.group({
          destination: [itinerary.destination, Validators.required],
          startDate: [new Date(itinerary.startDate), Validators.required],
          endDate: [new Date(itinerary.endDate), Validators.required],
          budget: [itinerary.budget, [Validators.required, Validators.min(1)]],
          preferences: [itinerary.preferences],
          notes: [itinerary.notes]
        });
        this.loading = false;
      } else {
        this.router.navigate(['/itineraries']);
      }
    });
  }

  save(): void {
    if (this.editForm.valid) {
      this.saving = true;
      this.itineraryService.update(this.itineraryId, this.editForm.value).subscribe({
        next: (updated) => {
          this.saving = false;
          this.snackBar.open('Itinerary updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/itineraries', this.itineraryId]);
        },
        error: (err) => {
          this.saving = false;
          this.snackBar.open('Failed to update itinerary', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/itineraries', this.itineraryId]);
  }
}