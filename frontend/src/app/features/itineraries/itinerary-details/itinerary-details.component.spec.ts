import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryDetailsComponent } from './itinerary-details.component';

describe('ItineraryDetailsComponent', () => {
  let component: ItineraryDetailsComponent;
  let fixture: ComponentFixture<ItineraryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryDetailsComponent]
    });
    fixture = TestBed.createComponent(ItineraryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
