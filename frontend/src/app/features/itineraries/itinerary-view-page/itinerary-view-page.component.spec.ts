import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryViewPageComponent } from './itinerary-view-page.component';

describe('ItineraryViewPageComponent', () => {
  let component: ItineraryViewPageComponent;
  let fixture: ComponentFixture<ItineraryViewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItineraryViewPageComponent]
    });
    fixture = TestBed.createComponent(ItineraryViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
