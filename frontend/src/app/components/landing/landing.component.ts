import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    showAuthOptions = false;

    constructor(private router: Router) { }

    onGetStarted() {
        this.showAuthOptions = true;
    }

    navigateToLogin() {
        this.router.navigate(['/login']);
    }

    navigateToRegister() {
        this.router.navigate(['/register']);
    }
}
