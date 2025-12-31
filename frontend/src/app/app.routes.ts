import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./features/auth/not-authorized/not-authorized.component')
      .then(m => m.NotAuthorizedComponent)
  },
  {
    path: 'itineraries',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/itineraries/itinerary-list/itinerary-list.component')
          .then(m => m.ItineraryListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/itineraries/itinerary-create/itinerary-create.component')
          .then(m => m.ItineraryCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/itineraries/itinerary-details/itinerary-details.component')
          .then(m => m.ItineraryDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/itineraries/itinerary-edit/itinerary-edit.component')
          .then(m => m.ItineraryEditComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard(UserRole.ADMIN)],
    loadComponent: () => import('./admin/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: '/itineraries' }
];
