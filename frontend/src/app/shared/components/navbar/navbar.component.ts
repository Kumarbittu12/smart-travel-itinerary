import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="navbar" [class.transparent-navbar]="transparent">
      <div class="navbar-content">
        <!-- Logo -->
        <div class="logo" routerLink="/">
          <div class="logo-icon">
             <mat-icon>flight_takeoff</mat-icon>
          </div>
          <span class="logo-text">GHAFUR</span>
        </div>

        <!-- Links (Desktop) -->
        <div class="nav-links">
          <a routerLink="/" fragment="home" (click)="scrollToTop()">Home</a>
          <a routerLink="/itineraries">Service</a>
          <a routerLink="/itineraries">Gallery</a>
          <a routerLink="/itineraries">Deals</a>
          <a routerLink="/itineraries">Package</a>
          <a routerLink="/itineraries">Blog</a>
          <a routerLink="/itineraries">Contact</a>
        </div>

        <!-- Right Side: Search & Booking & User -->
        <div class="nav-actions">
           <button mat-icon-button class="search-icon-btn">
              <mat-icon>search</mat-icon>
           </button>
           
           <button mat-flat-button color="warn" class="booking-btn">Booking Now</button>

           <!-- User Menu (Keep existing functionality) -->
           <div class="user-section" *ngIf="user$ | async as user; else loginButton">
               <button mat-icon-button [matMenuTriggerFor]="menu" class="user-menu-btn">
                <mat-icon>account_circle</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item routerLink="/itineraries">My Trips</button>
                <button mat-menu-item (click)="logout()">Logout</button>
              </mat-menu>
           </div>
           <ng-template #loginButton>
              <button mat-button routerLink="/login" class="login-link">Login</button>
           </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #2c1e4a; /* Deep Indigo from screenshot */
      color: white;
      height: 80px;
      padding: 0 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: background-color 0.3s;
    }

    .navbar-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    
    .logo-icon {
        background: linear-gradient(45deg, #ff4d4d, #a400ff);
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .logo-icon mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: white;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Links */
    .nav-links {
      display: flex;
      gap: 25px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      transition: color 0.3s;
      opacity: 0.9;
    }

    .nav-links a:hover, .nav-links a.active {
      color: #ff4d4d; /* Coral highlight */
      opacity: 1;
    }

    /* Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .search-icon-btn {
        background: #ff4d4d;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .search-icon-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
    }

    .booking-btn {
      background-color: #ff4d4d !important;
      color: white !important;
      font-weight: 700;
      padding: 0 25px;
      height: 40px;
      border-radius: 4px;
    }
    
    .login-link {
        color: white;
        font-weight: 600;
    }

    /* Transparent Mode overrides */
    .transparent-navbar {
      background-color: transparent;
      box-shadow: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    
    .transparent-navbar .navbar {
        background: transparent;
        box-shadow: none;
    }

    @media (max-width: 900px) {
      .nav-links {
        display: none; /* Mobile menu todo */
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  @Input() transparent = false;
  user$!: Observable<User | null>;
  UserRole = UserRole;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user$ = this.auth.authState$.pipe(
      map(state => state.user)
    );
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}