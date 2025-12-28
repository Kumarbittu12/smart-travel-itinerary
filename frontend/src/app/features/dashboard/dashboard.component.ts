
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ItineraryService } from '../../core/services/itinerary.service';
import { StorageService } from '../../core/services/storage.service';
import { Itinerary } from '../../core/models/itinerary.model';
import { User } from '../../core/models/user.model';


interface DashboardStats {
  totalUsers: number;
  totalItineraries: number;
  totalRevenue: number;
  popularDestinations: { destination: string; count: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,

  ],
  template: `

    
    <div class="container">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Overview of your travel planning platform</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card">
          <div class="stat-icon users">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon itineraries">
            <mat-icon>flight_takeoff</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalItineraries }}</span>
            <span class="stat-label">Itineraries Created</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon revenue">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">\${{ stats.totalRevenue.toLocaleString() }}</span>
            <span class="stat-label">Total Budget Planned</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon destinations">
            <mat-icon>explore</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.popularDestinations.length }}</span>
            <span class="stat-label">Unique Destinations</span>
          </div>
        </mat-card>
      </div>

      <!-- Popular Destinations -->
      <mat-card class="section-card" *ngIf="stats">
        <h2>
          <mat-icon>place</mat-icon>
          Popular Destinations
        </h2>
        <div class="destinations-grid">
          <div class="destination-card" *ngFor="let dest of stats.popularDestinations.slice(0, 6)">
            <div class="destination-name">{{ dest.destination }}</div>
            <div class="destination-count">
              <mat-icon>flight</mat-icon>
              {{ dest.count }} trips
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Recent Itineraries -->
      <mat-card class="section-card">
        <h2>
          <mat-icon>schedule</mat-icon>
          Recent Itineraries
        </h2>
        <div class="table-container">
          <table mat-table [dataSource]="recentItineraries" class="itinerary-table">
            <ng-container matColumnDef="destination">
              <th mat-header-cell *matHeaderCellDef>Destination</th>
              <td mat-cell *matCellDef="let item">
                <div class="destination-cell">
                  <mat-icon>place</mat-icon>
                  {{ item.destination }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Travel Dates</th>
              <td mat-cell *matCellDef="let item">
                {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
              </td>
            </ng-container>

            <ng-container matColumnDef="budget">
              <th mat-header-cell *matHeaderCellDef>Budget</th>
              <td mat-cell *matCellDef="let item">
                <span class="budget-value">\${{ item.budget }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let item">
                <mat-chip [class]="getStatusClass(item)">
                  {{ getStatus(item) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="created">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let item">
                {{ formatDate(item.createdAt) }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card>

      <!-- Users Overview -->
      <mat-card class="section-card">
        <h2>
          <mat-icon>people</mat-icon>
          Registered Users
        </h2>
        <div class="users-grid">
          <div class="user-card" *ngFor="let user of users">
            <mat-icon class="user-avatar">account_circle</mat-icon>
            <div class="user-info">
              <strong>{{ user.name }}</strong>
              <span>{{ user.email }}</span>
              <mat-chip class="role-chip">{{ user.role }}</mat-chip>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 30px 20px; }
    .header { margin-bottom: 30px; }
    h1 { font-size: 36px; margin: 0 0 10px 0; color: #333; }
    .subtitle { color: #666; font-size: 16px; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { display: flex; align-items: center; padding: 24px; gap: 20px; transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .stat-icon.users { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.itineraries { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.revenue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.destinations { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 32px; font-weight: 700; color: #333; line-height: 1; margin-bottom: 5px; }
    .stat-label { font-size: 14px; color: #666; }
    .section-card { padding: 30px; margin-bottom: 30px; }
    .section-card h2 { display: flex; align-items: center; gap: 10px; font-size: 22px; margin: 0 0 20px 0; color: #333; }
    .destinations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .destination-card { padding: 20px; background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; border: 2px solid #667eea30; transition: all 0.2s; }
    .destination-card:hover { transform: translateY(-2px); border-color: #667eea; }
    .destination-name { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .destination-count { display: flex; align-items: center; gap: 5px; color: #667eea; font-size: 14px; font-weight: 500; }
    .destination-count mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .table-container { overflow-x: auto; }
    .itinerary-table { width: 100%; }
    .destination-cell { display: flex; align-items: center; gap: 8px; }
    .destination-cell mat-icon { color: #667eea; }
    .budget-value { font-weight: 600; color: #4caf50; }
    mat-chip { font-size: 12px; }
    .status-upcoming { background: #e3f2fd !important; color: #1976d2 !important; }
    .status-ongoing { background: #e8f5e9 !important; color: #388e3c !important; }
    .status-completed { background: #f3e5f5 !important; color: #7b1fa2 !important; }
    .users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
    .user-card { display: flex; align-items: center; gap: 15px; padding: 20px; background: #f9f9f9; border-radius: 12px; transition: all 0.2s; }
    .user-card:hover { background: #f0f0f0; transform: translateX(4px); }
    .user-avatar { font-size: 48px; width: 48px; height: 48px; color: #667eea; }
    .user-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .user-info strong { font-size: 16px; color: #333; }
    .user-info span { font-size: 13px; color: #666; }
    .role-chip { align-self: flex-start; margin-top: 4px; }
    @media (max-width: 768px) { .stats-grid, .destinations-grid, .users-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  stats!: DashboardStats;
  recentItineraries!: MatTableDataSource<Itinerary>;
  users: User[] = [];
  displayedColumns = ['destination', 'dates', 'budget', 'status', 'created'];

  constructor(
    private itineraryService: ItineraryService,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.users = this.storage.getItem<User[]>('users') || [];

    this.itineraryService.getAll().subscribe(itineraries => {
      // Dashboard stats
      const destinationMap = new Map<string, number>();
      let totalRevenue = 0;

      itineraries.forEach(i => {
        destinationMap.set(i.destination, (destinationMap.get(i.destination) || 0) + 1);
        totalRevenue += i.budget;
      });

      const popularDestinations = Array.from(destinationMap.entries())
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count);

      this.stats = {
        totalUsers: this.users.length,
        totalItineraries: itineraries.length,
        totalRevenue,
        popularDestinations
      };

      // Recent itineraries for table
      const recent = itineraries
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      this.recentItineraries = new MatTableDataSource(recent);
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getStatus(itinerary: Itinerary): string {
    const today = new Date();
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);

    if (today < start) return 'Upcoming';
    if (today > end) return 'Completed';
    return 'Ongoing';
  }

  getStatusClass(itinerary: Itinerary): string {
    return `status-${this.getStatus(itinerary).toLowerCase()}`;
  }
}
