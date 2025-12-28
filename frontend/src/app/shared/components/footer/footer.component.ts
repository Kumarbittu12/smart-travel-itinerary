
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <!-- Col 1: Brand & About -->
        <div class="footer-col">
          <div class="footer-logo">
            <mat-icon>flight_takeoff</mat-icon> Travel Planner
          </div>
          <p class="about-text">
            We are a team of experienced travel enthusiasts who want to help you explore the world. 
            Our mission is to make travel planning easy, affordable, and fun.
          </p>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
          </div>
        </div>

        <!-- Col 2: Quick Links -->
        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/itineraries">Tours</a></li>
            <li><a routerLink="/itineraries/new">Plan Trip</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <!-- Col 3: Contact Info -->
        <div class="footer-col">
          <h3>Contact Us</h3>
          <ul class="contact-info">
            <li>
              <mat-icon>place</mat-icon>
              <span>123 Travel Street, New York, NY 10001</span>
            </li>
            <li>
              <mat-icon>phone</mat-icon>
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <mat-icon>email</mat-icon>
              <span>contact@travelplanner.com</span>
            </li>
          </ul>
        </div>

        <!-- Col 4: Newsletter -->
        <div class="footer-col">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for the latest travel updates and offers.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email">
            <button mat-flat-button color="primary">Subscribe</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 Travel Planner. All rights reserved.</p>
        <div class="payment-icons">
           <!-- Placeholder for payment icons if needed -->
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #1a1a1a;
      color: #fff;
      padding-top: 50px; /* Reduced from 80px */
      margin-top: 40px;
      font-size: 14px; /* Smaller base font */
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Smaller columns */
      gap: 30px;
      padding-bottom: 30px; /* Reduced from 60px */
    }
    
    .footer-logo {
      font-size: 20px; /* Smaller logo */
      margin-bottom: 15px;
    }
    
    h3 {
      font-size: 16px; /* Smaller headers */
      margin-bottom: 15px;
      padding-bottom: 10px;
    }

    
    h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 40px;
      height: 2px;
      background-color: #ffb300;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: #ffb300;
      padding-left: 5px;
    }

    .contact-info {
      list-style: none;
      padding: 0;
    }

    .contact-info li {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      margin-bottom: 20px;
      color: #aaa;
    }

    .contact-info mat-icon {
      color: #ffb300;
      font-size: 20px;
      width: 20px;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }

    .newsletter-form input {
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #333;
      background: #2a2a2a;
      color: white;
      outline: none;
    }
    
    .newsletter-form input:focus {
        border-color: #ffb300;
    }

    .newsletter-form button {
      height: 48px;
    }

    .footer-bottom {
      border-top: 1px solid #333;
      padding: 25px 20px;
      text-align: center;
      color: #777;
    }
  `]
})
export class FooterComponent { }
