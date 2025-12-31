import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Itinerary {
  id: string;
  destination: string;
  title: string;
  price: number;
  days: number;
  schedule: string[];
  activities: string[];
  notes?: string;
  media: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private itineraries: Itinerary[] = [
    { id: '1', destination: 'Goa', title: 'Goa Beach Budget Trip', price: 12000, days: 3, schedule: ['Day 1: Beach', 'Day 2: Party', 'Day 3: Departure'], activities: ['Beach', 'Party'], notes: 'Best season: Nov-Feb', media: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'] },
    { id: '2', destination: 'Kerala', title: 'Kerala Backwater Trip', price: 15000, days: 4, schedule: ['Day 1: Arrival', 'Day 2: Houseboat', 'Day 3: Tea Gardens', 'Day 4: Departure'], activities: ['Houseboat', 'Trekking'], notes: 'Famous for backwaters', media: ['https://images.unsplash.com/photo-1549887534-18c0f92d0c38?w=800'] },
    { id: '3', destination: 'Paris', title: 'Paris City Tour', price: 40000, days: 5, schedule: ['Day 1: Eiffel Tower', 'Day 2: Louvre', 'Day 3: Seine Cruise', 'Day 4: Montmartre', 'Day 5: Departure'], activities: ['Sightseeing', 'Museum'], media: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'] },
    { id: '4', destination: 'Tokyo', title: 'Tokyo Highlights', price: 35000, days: 6, schedule: ['Day 1: Arrival', 'Day 2: Shibuya', 'Day 3: Temples', 'Day 4: Disneyland', 'Day 5: Shopping', 'Day 6: Departure'], activities: ['City Tour', 'Cultural Visit'], media: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'] },
    { id: '5', destination: 'New York', title: 'NYC Weekend Trip', price: 30000, days: 4, schedule: ['Day 1: Arrival', 'Day 2: Statue of Liberty', 'Day 3: Central Park', 'Day 4: Departure'], activities: ['Sightseeing', 'Shopping'], media: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'] }
  ];

  constructor() {}

  getAll(): Observable<Itinerary[]> {
    return of(this.itineraries);
  }

  getById(id: string): Observable<Itinerary | undefined> {
    return of(this.itineraries.find(i => i.id === id));
  }

  search(destination: string, budget: number): Observable<Itinerary[]> {
    return of(this.itineraries.filter(t => t.destination.toLowerCase() === destination.toLowerCase() && t.price <= budget));
  }
}
