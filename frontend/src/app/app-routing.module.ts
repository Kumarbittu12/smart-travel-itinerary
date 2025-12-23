import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ItineraryListComponent } from './components/itinerary-list/itinerary-list.component';
import { ItineraryCreateComponent } from './components/itinerary-create/itinerary-create.component';

import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'itineraries', component: ItineraryListComponent },
  { path: 'itineraries/new', component: ItineraryCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
