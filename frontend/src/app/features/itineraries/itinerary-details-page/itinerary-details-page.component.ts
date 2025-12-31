import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-itinerary-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './itinerary-details-page.component.html',
  styleUrls: ['./itinerary-details-page.component.scss']
})
export class ItineraryDetailsPageComponent implements OnInit {

  destination = '';
  budget = 0;
  filteredTrips: any[] = [];
  suggestedBudgets = [20000, 25000, 30000]; // clickable suggestions

 allTrips = [
  // Goa – 5 trips
  { destination: 'Goa', title: 'Goa Beach Budget Trip', price: 12000, days: 3, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { destination: 'Goa', title: 'Goa Luxury Stay', price: 20000, days: 4, image: 'https://images.unsplash.com/photo-1565101705758-20f21a1298a5?w=800' },
  { destination: 'Goa', title: 'Goa Party Trip', price: 25000, days: 4, image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c0?w=800' },
  { destination: 'Goa', title: 'Goa Adventure Trip', price: 18000, days: 3, image: 'https://images.unsplash.com/photo-1562158070-36b9491d5e22?w=800' },
  { destination: 'Goa', title: 'Goa Sunset Cruise', price: 22000, days: 4, image: 'https://images.unsplash.com/photo-1551018550-5a6e8b3a1ed0?w=800' },

  // Kerala – 5 trips
  { destination: 'Kerala', title: 'Kerala Backwater Trip', price: 15000, days: 4, image: 'https://images.unsplash.com/photo-1549887534-18c0f92d0c38?w=800' },
  { destination: 'Kerala', title: 'Kerala Luxury Stay', price: 25000, days: 5, image: 'https://images.unsplash.com/photo-1579046960625-0df9db0b4270?w=800' },
  { destination: 'Kerala', title: 'Kerala Ayurveda Retreat', price: 30000, days: 5, image: 'https://images.unsplash.com/photo-1542223616-0b6e1c32a2b2?w=800' },
  { destination: 'Kerala', title: 'Kerala Hill Station', price: 20000, days: 4, image: 'https://images.unsplash.com/photo-1553524789-9b7f0a1b98e6?w=800' },
  { destination: 'Kerala', title: 'Kerala Nature Walk', price: 18000, days: 3, image: 'https://images.unsplash.com/photo-1523206489230-c49e9f94c48c?w=800' },

  // Paris – 3 trips
  { destination: 'Paris', title: 'Paris City Tour', price: 40000, days: 5, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { destination: 'Paris', title: 'Paris Luxury Stay', price: 60000, days: 6, image: 'https://images.unsplash.com/photo-1526481280698-3e9a15b9f16f?w=800' },
  { destination: 'Paris', title: 'Paris Food & Wine', price: 35000, days: 4, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800' },

  // Tokyo – 3 trips
  { destination: 'Tokyo', title: 'Tokyo Highlights', price: 35000, days: 6, image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800' },
  { destination: 'Tokyo', title: 'Tokyo Culture Tour', price: 40000, days: 5, image: 'https://images.unsplash.com/photo-1555685812-4b943f1b8ee3?w=800' },
  { destination: 'Tokyo', title: 'Tokyo Luxury Stay', price: 50000, days: 6, image: 'https://images.unsplash.com/photo-1549692520-5c7e6a823c1f?w=800' },

  // New York – 3 trips
  { destination: 'New York', title: 'NYC Weekend Trip', price: 30000, days: 4, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
  { destination: 'New York', title: 'NYC Luxury Trip', price: 50000, days: 5, image: 'https://images.unsplash.com/photo-1508050919630-b135583b29d4?w=800' },
  { destination: 'New York', title: 'NYC Culture & Food', price: 40000, days: 5, image: 'https://images.unsplash.com/photo-1520975919770-5cfcf1f82ff4?w=800' },

  // Dubai – 2 trips
  { destination: 'Dubai', title: 'Dubai Adventure', price: 28000, days: 4, image: 'https://images.unsplash.com/photo-1506086679524-44d3f3fd10b3?w=800' },
  { destination: 'Dubai', title: 'Dubai Luxury Stay', price: 45000, days: 5, image: 'https://images.unsplash.com/photo-1526481280698-3e9a15b9f16f?w=800' },

  // Bali – 2 trips
  { destination: 'Bali', title: 'Bali Beach Escape', price: 22000, days: 5, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  { destination: 'Bali', title: 'Bali Luxury Resort', price: 35000, days: 6, image: 'https://images.unsplash.com/photo-1507525428034-5a723cf961d3?w=800' },

  // Maldives – 2 trips
  { destination: 'Maldives', title: 'Maldives Relax Trip', price: 50000, days: 5, image: 'https://images.unsplash.com/photo-1549887534-18c0f92d0c38?w=800' },
  { destination: 'Maldives', title: 'Maldives Overwater Villas', price: 65000, days: 6, image: 'https://images.unsplash.com/photo-1549887534-0b6e1c32a2b2?w=800' },

  // London – 1 trip
  { destination: 'London', title: 'London Heritage Tour', price: 32000, days: 6, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },

  // Rome – 1 trip
  { destination: 'Rome', title: 'Rome Historical Trip', price: 30000, days: 5, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' }
];


  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.destination = params['destination'] || '';
      this.budget = +params['budget'] || 0;

      this.filterTrips();
    });
  }

  filterTrips() {
    this.filteredTrips = this.allTrips.filter(
      trip => trip.destination.toLowerCase() === this.destination.toLowerCase() && trip.price <= this.budget
    );
  }

  // 🔹 When user clicks a suggested budget
  updateBudget(newBudget: number) {
    this.budget = newBudget;
    this.filterTrips();
  }

  goBack() {
    this.router.navigate(['/itinerary-list']);
  }
  
  
}
