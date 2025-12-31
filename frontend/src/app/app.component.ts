import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'smart-travel-planner';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.get('')
      .then(response => {
        console.log('Backend connection successful:', response.data);
      })
      .catch(error => {
        console.error('Backend connection failed:', error);
      });
  }
}

