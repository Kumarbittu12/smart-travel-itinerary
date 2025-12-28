import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ApiService } from '../../services/api.service';
import { Itinerary, DayPlan, ActivityType, Activity } from '../models/itinerary.model';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private itinerariesSubject = new BehaviorSubject<Itinerary[]>([]);
  public itineraries$ = this.itinerariesSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private auth: AuthService
  ) { }

  getAll(): Observable<Itinerary[]> {
    const user = this.auth.getCurrentUser();
    const endpoint = user?.role === UserRole.ADMIN
      ? 'api/itineraries/v1'
      : 'api/itineraries/v1/me';

    return from(this.apiService.get(endpoint)).pipe(
      map((response: any) => {
        let items: any[] = [];
        if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data.itineraries) {
          items = response.data.itineraries;
        }

        const itineraries = items.map(item => this.mapToFrontend(item));
        this.itinerariesSubject.next(itineraries);
        return itineraries;
      })
    );
  }

  getById(id: string): Observable<Itinerary | undefined> {
    return from(this.apiService.get(`api/itineraries/v1/${id}`)).pipe(
      map((response: any) => this.mapToFrontend(response.data))
    );
  }

  create(itinerary: Partial<Itinerary>): Observable<Itinerary> {
    // 1. Auto-generate day plans if not present
    if (!itinerary.dayPlans || itinerary.dayPlans.length === 0) {
      itinerary.dayPlans = this.generateDayPlans(
        itinerary.startDate!,
        itinerary.endDate!,
        itinerary.preferences || []
      );
    }

    // 2. Add dynamic cover image if media is empty
    if (!itinerary.media || itinerary.media.length === 0) {
      // Use LoremFlickr for dynamic images based on destination
      const safeDest = encodeURIComponent(itinerary.destination || 'travel');
      // Adding a timestamp to break cache if needed, but for persistence we want a stable URL
      // We will rely on destination-based variety from the service
      itinerary.media = [`https://loremflickr.com/800/600/${safeDest},travel/all`];
    }

    // 3. Calculate total cost for the new itinerary
    itinerary.totalEstimatedCost = this.calculateTotalCost(itinerary as Itinerary);

    // 4. Prepare payload for backend
    const payload = this.mapToBackend(itinerary);

    // 5. Send to backend
    return from(this.apiService.post('api/itineraries/v1', payload)).pipe(
      map((response: any) => {
        const newItinerary = {
          ...itinerary,
          id: response.data.itineraryId,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Itinerary;

        const current = this.itinerariesSubject.value;
        this.itinerariesSubject.next([...current, newItinerary]);

        return newItinerary;
      })
    );
  }

  update(id: string, updates: Partial<Itinerary>): Observable<Itinerary> {
    const payload = this.mapToBackend(updates);
    return from(this.apiService.put(`api/itineraries/v1/${id}`, payload)).pipe(
      map((response: any) => {
        const current = this.itinerariesSubject.value;
        const index = current.findIndex(i => i.id === id);
        if (index !== -1) {
          const updated = { ...current[index], ...updates };
          // Recalculate cost if plans changed
          if (updates.dayPlans) {
            updated.totalEstimatedCost = this.calculateTotalCost(updated);
          }
          current[index] = updated as Itinerary;
          this.itinerariesSubject.next([...current]);
          return updated as Itinerary;
        }
        return updates as Itinerary;
      })
    );
  }

  delete(id: string): Observable<boolean> {
    return from(this.apiService.delete(`api/itineraries/v1/${id}`)).pipe(
      map(() => {
        const current = this.itinerariesSubject.value;
        const filtered = current.filter(i => i.id !== id);
        this.itinerariesSubject.next(filtered);
        return true;
      })
    );
  }

  // --- Auto-Generation Logic ---

  private generateDayPlans(startDate: Date, endDate: Date, preferences: ActivityType[]): DayPlan[] {
    const days = this.getDaysBetween(startDate, endDate);
    const dayPlans: DayPlan[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const activities = this.generateMockActivities(preferences);

      dayPlans.push({
        day: i + 1,
        date,
        activities,
        totalCost: activities.reduce((sum, a) => sum + a.estimatedCost, 0),
        travelTime: Math.floor(Math.random() * 120) + 30
      });
    }

    return dayPlans;
  }

  private generateMockActivities(preferences: ActivityType[]): Activity[] {
    const activityTemplates = [
      { name: 'Visit Local Museum', type: ActivityType.SIGHTSEEING, cost: 20 },
      { name: 'City Walking Tour', type: ActivityType.SIGHTSEEING, cost: 30 },
      { name: 'Mountain Hiking', type: ActivityType.ADVENTURE, cost: 50 },
      { name: 'Water Sports', type: ActivityType.ADVENTURE, cost: 80 },
      { name: 'Spa & Wellness', type: ActivityType.RELAXATION, cost: 100 },
      { name: 'Beach Time', type: ActivityType.RELAXATION, cost: 0 },
      { name: 'Local Restaurant', type: ActivityType.DINING, cost: 40 },
      { name: 'Street Food Tour', type: ActivityType.DINING, cost: 25 },
      { name: 'Shopping Mall Visit', type: ActivityType.SHOPPING, cost: 50 }
    ];

    const selectedTemplates = preferences && preferences.length > 0
      ? activityTemplates.filter(t => preferences.includes(t.type))
      : activityTemplates;

    const numActivities = Math.floor(Math.random() * 3) + 2;
    const activities: Activity[] = [];

    for (let i = 0; i < numActivities; i++) {
      const source = selectedTemplates.length > 0 ? selectedTemplates : activityTemplates;
      const template = source[Math.floor(Math.random() * source.length)];
      const startHour = 9 + i * 3;

      activities.push({
        id: this.generateId(),
        name: template.name,
        type: template.type,
        duration: Math.floor(Math.random() * 120) + 60,
        estimatedCost: template.cost + Math.floor(Math.random() * 20),
        location: 'City Center',
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        notes: ''
      });
    }

    return activities;
  }

  private calculateTotalCost(itinerary: Itinerary): number {
    if (!itinerary.dayPlans) return 0;
    return itinerary.dayPlans.reduce((sum, day) => sum + (day.totalCost || 0), 0);
  }

  private getDaysBetween(start: Date, end: Date): number {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // --- Data Mappers ---

  private mapToFrontend(data: any): Itinerary {
    const dayPlans = typeof data.activities === 'string' ? JSON.parse(data.activities) : (data.activities || []);
    const totalEstimatedCost = dayPlans.reduce((sum: number, day: any) => sum + (day.totalCost || 0), 0);

    return {
      id: data.id,
      userId: data.user_id,
      destination: data.destination,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      budget: data.budget,
      preferences: [],
      dayPlans: dayPlans,
      totalEstimatedCost: totalEstimatedCost,
      notes: data.notes,
      media: typeof data.media_paths === 'string' ? JSON.parse(data.media_paths) : (data.media_paths || []),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
      isPublic: !!data.is_public
    } as Itinerary;
  }

  private mapToBackend(itinerary: Partial<Itinerary>): any {
    const formatDate = (date: Date | string | undefined): string | null => {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    return {
      destination: itinerary.destination,
      start_date: formatDate(itinerary.startDate),
      end_date: formatDate(itinerary.endDate),
      budget: itinerary.budget,
      activities: itinerary.dayPlans,
      notes: itinerary.notes,
      media_paths: itinerary.media
    };
  }
}