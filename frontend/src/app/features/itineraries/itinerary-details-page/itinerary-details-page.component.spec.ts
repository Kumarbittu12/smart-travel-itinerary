import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryDetailsPageComponent } from './itinerary-details-page.component';

describe('ItineraryDetailsPageComponent', () => {
  let component: ItineraryDetailsPageComponent;
  let fixture: ComponentFixture<ItineraryDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItineraryDetailsPageComponent]
    });
    fixture = TestBed.createComponent(ItineraryDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
