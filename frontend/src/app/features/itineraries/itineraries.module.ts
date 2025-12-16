import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItinerariesRoutingModule } from './itineraries-routing.module';
import { ItineraryListComponent } from './itinerary-list/itinerary-list.component';
import { ItineraryDetailsComponent } from './itinerary-details/itinerary-details.component';
import { ItineraryCreateComponent } from './itinerary-create/itinerary-create.component';
import { ItineraryEditComponent } from './itinerary-edit/itinerary-edit.component';


@NgModule({
  declarations: [
    ItineraryListComponent,
    ItineraryDetailsComponent,
    ItineraryCreateComponent,
    ItineraryEditComponent
  ],
  imports: [
    CommonModule,
    ItinerariesRoutingModule
  ]
})
export class ItinerariesModule { }
