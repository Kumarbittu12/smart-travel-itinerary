import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';
import { ItineraryDetailsPageComponent } from './features/itineraries/itinerary-details-page/itinerary-details-page.component';
import { ItineraryViewPageComponent } from './features/itineraries/itinerary-view-page/itinerary-view-page.component';

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
      },
      {
  path: 'search',
  loadComponent: () =>
    import('./features/itineraries/itinerary-details-page/itinerary-details-page.component')
      .then(m => m.ItineraryDetailsPageComponent)
},

     {
  path: 'view/:id',
  loadComponent: () =>
    import('./features/itineraries/itinerary-view-page/itinerary-view-page.component')
      .then(m => m.ItineraryViewPageComponent)
}

    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard(UserRole.ADMIN)],
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
   {path:'itinerary-details-page',component:ItineraryDetailsPageComponent},
  // {path:'itinerary-view-page',component:ItineraryViewPageComponent},
  
  { path: '**', redirectTo: '/itineraries' },
  
];
