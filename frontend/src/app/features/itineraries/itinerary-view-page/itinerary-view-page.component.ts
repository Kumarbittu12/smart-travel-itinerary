import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ItineraryService, Itinerary } from '../services/itinerary.service';

@Component({
  selector: 'app-itinerary-view-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatChipsModule],
  templateUrl: './itinerary-view-page.component.html',
  styleUrls: ['./itinerary-view-page.component.scss']
})
export class ItineraryViewPageComponent implements OnInit {
  itinerary: Itinerary | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private itineraryService: ItineraryService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itineraryService.getById(id).subscribe(t => this.itinerary = t);
    }
  }

  goBack() {
    this.router.navigate(['/itinerary-list']);
  }
}
