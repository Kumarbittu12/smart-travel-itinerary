
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatSelectModule,
        NavbarComponent,
        FooterComponent
    ],
    template: `
    <!-- Top Bar (Purple) -->
    <!-- <div class="top-bar"> -->
        <!-- <div class="container top-bar-content"> -->
             <!-- <div class="contact-info">
                 <span><mat-icon>email</mat-icon> info@mail.com</span>
                 <span><mat-icon>phone</mat-icon> (451) 236 9814</span>
                 <span><mat-icon>schedule</mat-icon> Mon-Fri: 8:00am-5:00pm</span>
             </div> -->
             <!-- <div class="social-icons">
                 <mat-icon>facebook</mat-icon>
                 <mat-icon>share</mat-icon>
             </div> -->
        <!-- </div> -->
    <!-- </div> -->

    <!-- Transparent Navbar with Background for hero -->
    <div class="hero-wrapper">
         <app-navbar [transparent]="true"></app-navbar>
         
         <!-- Hero Section -->
         <div class="hero-section" [style.background-image]="currentHeroImage">
            <div class="hero-content">
              <h1>The World in Tour</h1>
              <p>Tour and travel agencies can be various ways. Broadly, they can be classified by their focus their physical presence</p>
              <button mat-flat-button color="warn" class="discover-btn" routerLink="/itineraries">Discover Now</button>
            </div>
         </div>
         
         <!-- Previous/Next Arrows (Visual Only) -->
         <button class="hero-arrow prev" (click)="prevSlide()"><mat-icon>arrow_back</mat-icon></button>
         <button class="hero-arrow next" (click)="nextSlide()"><mat-icon>arrow_forward</mat-icon></button>
    </div>

    <!-- Features / Icons Section -->
    <div class="section-container features-section">
        <div class="feature-item">
            <div class="icon-box rocket"><mat-icon>rocket_launch</mat-icon></div>
            <h3>Flight Tickets</h3>
            <p>Cater to specific types of travelers or travel interests, in adventure travelers</p>
        </div>
        <div class="feature-item">
             <div class="icon-box hotel"><mat-icon>hotel</mat-icon></div>
            <h3>Hotel Reservation</h3>
            <p>Cater to specific types of travelers or travel interests, in adventure travelers</p>
        </div>
        <div class="feature-item">
             <div class="icon-box guide"><mat-icon>map</mat-icon></div>
            <h3>Travel Guide</h3>
            <p>Cater to specific types of travelers or travel interests, in adventure travelers</p>
        </div>
        <div class="feature-item">
             <div class="icon-box activities"><mat-icon>hiking</mat-icon></div>
            <h3>Trip Activities</h3>
            <p>Cater to specific types of travelers or travel interests, in adventure travelers</p>
        </div>
    </div>
    
    <!-- We Provide Service -->
    <div class="section-container service-section">
        <div class="service-image">
             <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop" alt="Traveler">
             <div class="play-btn"><mat-icon>play_arrow</mat-icon></div>
        </div>
        <div class="service-content">
             <h4 class="sub-title">We Provide Service</h4>
             <h2>Create a Service provider is to provide best service</h2>
             <div class="divider"></div>
             
             <div class="service-grid">
                 <div class="service-card">
                     <mat-icon class="s-icon">verified</mat-icon>
                     <div>
                         <h4>Quality Service</h4>
                         <p>Lorem ipsum dolor sit amet, consectetur adipisc sed</p>
                     </div>
                 </div>
                 <div class="service-card">
                     <mat-icon class="s-icon">health_and_safety</mat-icon>
                     <div>
                         <h4>Stay Safe</h4>
                         <p>Lorem ipsum dolor sit amet, consectetur adipisc sed</p>
                     </div>
                 </div>
                 <div class="service-card">
                     <mat-icon class="s-icon">wifi</mat-icon>
                     <div>
                         <h4>Free Wifi</h4>
                         <p>Lorem ipsum dolor sit amet, consectetur adipisc sed</p>
                     </div>
                 </div>
                 <div class="service-card">
                     <mat-icon class="s-icon">savings</mat-icon>
                     <div>
                         <h4>Save Money</h4>
                         <p>Lorem ipsum dolor sit amet, consectetur adipisc sed</p>
                     </div>
                 </div>
             </div>
        </div>
    </div>
    
    <!-- Stats Section -->
    <div class="stats-section">
        <div class="section-header">
             <h4 class="sub-title" style="color:#ff4d4d">Tour Statistics</h4>
             <h2>We Expert Our Tour</h2>
             <div class="divider-center"></div>
        </div>
        
        <div class="stats-grid container">
             <div class="stat-item">
                 <div class="stat-icon"><mat-icon>airport_shuttle</mat-icon></div>
                 <h3>3,000</h3>
                 <p>Vip Transport Options</p>
             </div>
             <div class="stat-item">
                 <div class="stat-icon"><mat-icon>star</mat-icon></div>
                 <h3>3,425</h3>
                 <p>Satisfy Client For Service</p>
             </div>
             <div class="stat-item">
                 <div class="stat-icon"><mat-icon>group</mat-icon></div>
                 <h3>2,500</h3>
                 <p>Our Happy In Customer</p>
             </div>
             <div class="stat-item">
                 <div class="stat-icon"><mat-icon>apartment</mat-icon></div>
                 <h3>4,000</h3>
                 <p>5 Start Hotels To With Says</p>
             </div>
        </div>
    </div>
    
    <!-- Most Tourist Popular Place (Destinations) -->
    <div class="section-container">
        <div class="section-header">
             <h4 class="sub-title">Tour Destinations</h4>
             <h2>Most Tourist Popular Place</h2>
              <div class="divider-center"></div>
             <p>Specialize in organizing travel for business purposes, including meetings,</p>
             <p>conferences, and corporate events provide face-to-face</p>
        </div>
        
        <div class="filter-tabs">
            <span class="active">All Tour</span>
            <span>Russia</span>
            <span>Canada</span>
            <span>France</span>
            <span>Europe</span>
        </div>
        
        <div class="popular-grid">
             <div class="place-card" *ngFor="let place of destinations">
                 <img [src]="place.image" [alt]="place.name">
                 <div class="place-overlay">
                     <!-- Hover content could go here -->
                 </div>
             </div>
        </div>
    </div>

    <app-footer></app-footer>
  `,
    styles: [`
    /* Global Template Colors */
    :host {
        --primary: #2c1e4a; /* Deep Indigo */
        --accent: #ff4d4d; /* Coral Red */
        --text: #333;
        --light-text: #666;
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Top Bar */
    .top-bar {
        background-color: var(--primary);
        color: rgba(255,255,255,0.8);
        font-size: 13px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .top-bar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .contact-info {
        display: flex;
        gap: 20px;
    }
    
    .contact-info span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .contact-info mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* Hero */
    .hero-wrapper {
        position: relative;
    }
    
    .hero-section {
      /* background-image set dynamically */
      background-size: cover;
      background-position: center;
      transition: background-image 0.1s ease-in-out; 
      height: 97vh;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
    }
    
    .hero-content {
        max-width: 800px;
        padding: 0 20px;
    }

    .hero-content h1 {
      font-size: 4.5rem;
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .discover-btn {
        background-color: var(--accent) !important;
        color: white !important;
        padding: 0 35px;
        height: 50px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 4px;
    }
    
    .hero-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.8;
    }
    
    .prev { left: 40px; }
    .next { right: 40px; }
    
    /* Features Section */
    .features-section {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        padding: 80px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .feature-item {
        flex: 1;
        text-align: left;
    }
    
    .icon-box {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }
    
    .icon-box mat-icon { font-size: 40px; width: 40px; height: 40px; }
    
    .rocket { color: #ff6b6b; }
    .hotel { color: #feca57; }
    .guide { color: #48dbfb; }
    .activities { color: #ff9f43; }
    
    .feature-item h3 {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--primary);
    }
    
    .feature-item p {
        color: var(--light-text);
        font-size: 14px;
        line-height: 1.6;
    }
    
    /* Service Section */
    .service-section {
        display: flex;
        gap: 50px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 80px 20px;
    }
    .service-image {
        flex: 1;
        position: relative;
    }
    .service-image img { width: 100%; border-radius: 8px; }
    .play-btn {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 60px; height: 60px;
        background: var(--accent);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: white;
        box-shadow: 0 0 0 10px rgba(255, 77, 77, 0.3);
    }
    
    .service-content { flex: 1; }
    
    .sub-title {
        color: var(--primary);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 5px;
        display: block;
    }
    
    .service-content h2 {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 20px;
        color: var(--primary);
    }
    
    .divider {
        width: 50px; height: 3px; background: #eee; margin-bottom: 30px;
        position: relative;
    }
    .divider::before {
        content:''; position: absolute; left: 0; width: 20px; height: 100%; background: var(--accent);
    }
    
    .service-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
    }
    .service-card { display: flex; gap: 15px; }
    .s-icon { color: var(--accent); }
    .service-card h4 { font-weight: 700; margin-bottom: 5px; }
    .service-card p { font-size: 13px; color: var(--light-text); }
    
    /* Stats Section */
    .stats-section {
        background: #f9f9f9;
        padding: 80px 0;
        text-align: center;
    }
    
    .divider-center {
        width: 50px; height: 3px; background: #ddd; margin: 15px auto 30px;
        position: relative;
    }
    .divider-center::before {
         content:''; position: absolute; left: 15px; width: 20px; height: 100%; background: var(--accent);
    }
    
    .stats-grid {
        display: flex; justify-content: space-between; gap: 30px;
    }
    .stat-item {
        background: white;
        padding: 40px 20px;
        flex: 1;
        box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        border-radius: 4px;
        transition: transform 0.3s;
    }
    .stat-item:hover { transform: translateY(-5px); }
    
    .stat-icon {
        margin-bottom: 20px; color: var(--accent); /* Could be colored per item */
    }
    .stat-icon mat-icon { font-size: 40px; width: 40px; height: 40px; }
    
    .stat-item h3 {
        font-size: 32px; font-weight: 800; color: var(--primary); margin-bottom: 5px;
    }
    .stat-item p { font-weight: 600; color: var(--text); }
    
    /* Popular Section */
    .section-header { text-align: center; margin-bottom: 50px; }
    .section-header h2 { font-size: 36px; font-weight: 800; color: var(--primary); }
    .section-header p { color: var(--light-text); margin: 0; }
    
    .filter-tabs {
        display: flex; justify-content: center; gap: 30px; margin-bottom: 40px;
    }
    .filter-tabs span {
        font-weight: 600; cursor: pointer; color: var(--text);
    }
    .filter-tabs span.active { color: var(--accent); }
    
    .popular-grid {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto;
    }
    .place-card {
        height: 250px; border-radius: 4px; overflow: hidden; position: relative;
    }
    .place-card img { width: 100%; height: 100%; object-fit: cover; }

    @media (max-width: 900px) {
        .features-section, .service-section, .stats-grid, .popular-grid {
            flex-direction: column; grid-template-columns: 1fr;
        }
        .hero-content h1 { font-size: 2.5rem; }
    }
  `]
})
export class LandingPageComponent {
    // Hero Slider State
    heroImages = [
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop', // Paris
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop', // Alps
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=2070&auto=format&fit=crop'  // Bali
    ];
    currentHeroIndex = 0;

    get currentHeroImage(): string {
        return `linear-gradient(rgba(44, 30, 74, 0.4), rgba(44, 30, 74, 0.4)), url('${this.heroImages[this.currentHeroIndex]}')`;
    }

    nextSlide() {
        this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
    }

    prevSlide() {
        this.currentHeroIndex = (this.currentHeroIndex - 1 + this.heroImages.length) % this.heroImages.length;
    }

    destinations = [
        {name:'Rameshavarm',image:'https://www.justahotels.com/wp-content/uploads/2024/02/Ramanathaswamy-Temple.jpg'},
        {name: 'KodaiKanal', image:'https://tourismtn.com/wp-content/uploads/2020/12/Chettiar-Park-Old-Banner.jpg'},
        {name: 'KodaiKanal', image:'https://www.aladdinholidays.com/wp-content/uploads/2024/09/kodaikanal-honeymoon.jpg'},
        {name: 'MinkashiTemple',image:'https://i.pinimg.com/736x/02/25/36/022536a2865b6163d19adafb45f1a104.jpg'},
        {name: 'KanyaKumari', image:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/bb/cf/09/thiruvalluvar-statue.jpg?w=1200&h=-1&s=1'},
        { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500' },
        { name: 'Singapore', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500' },
        { name: 'Canada', image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=500' },
        { name: 'Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500' },
          { name: 'Maldives', image: 'https://static.tripzilla.in/media/49215/conversions/ad2454cd-8275-4e33-9037-e009cc7b9392-w1024.webp' },
          {name: 'Valmikinagr', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG04fRNATRTfn-gIF34lsgdJ_pnBFH17s60w&s'},
        {name: 'Nepal', image:'https://nepaltreksandvoyage.wordpress.com/wp-content/uploads/2014/11/annapurna_trail_an_hanging_bridge_on_kali_gandaki_river.jpg'},
        

    ];
}
