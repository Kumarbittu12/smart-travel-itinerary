import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    // Form Inputs
    fromCity = 'London';
    toCity = 'Paris';
    departureDate: Date = new Date(); // Default safely in future if needed
    returnDate: Date = new Date();
    guests = 6;
    rooms = 3;

    // Filter Logic
    selectedFilter = 'All';
    filters = ['All', 'London', 'Birmingham', 'Manchester', 'Leicester', 'Plymouth', 'Derby'];

    // Mock Deals Data
    deals = [
        {
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop', // London
            discount: '30% off',
            place: 'London',
            title: 'Best of London',
            description: '19 days and 18 nights',
            rating: 4.5,
            price: '$1200'
        },
        {
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop', // Manchester (general city)
            discount: '20% off',
            place: 'Manchester',
            title: 'Experience Manchester',
            description: '8 days and 5 nights',
            rating: 4.5,
            price: '$850'
        },
        {
            image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop', // Spain/Mediterranean vibe
            discount: '40% off',
            place: 'Spain',
            title: 'Relax in Spain',
            description: '15 days and 14 nights',
            rating: 4.8,
            price: '$1600'
        }
    ];

    constructor(private router: Router) { }

    onCounterChange(field: 'guests' | 'rooms', type: 'add' | 'remove') {
        if (field === 'guests') {
            this.guests = type === 'add' ? this.guests + 1 : Math.max(1, this.guests - 1);
        } else {
            this.rooms = type === 'add' ? this.rooms + 1 : Math.max(1, this.rooms - 1);
        }
    }

    onFilterSelect(filter: string) {
        this.selectedFilter = filter;
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    navigateToRegister() {
        this.router.navigate(['/register']);
    }
}
