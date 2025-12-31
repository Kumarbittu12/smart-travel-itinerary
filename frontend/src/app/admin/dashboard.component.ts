
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ItineraryService } from '../core/services/itinerary.service';
import { StorageService } from '../core/services/storage.service';
import { Itinerary } from '../core/models/itinerary.model';
import { User } from '../core/models/user.model';


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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
        totalRevenue += Number(i.budget) || 0;
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
