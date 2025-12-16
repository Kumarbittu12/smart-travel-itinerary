import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryCreateComponent } from './itinerary-create.component';

describe('ItineraryCreateComponent', () => {
  let component: ItineraryCreateComponent;
  let fixture: ComponentFixture<ItineraryCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryCreateComponent]
    });
    fixture = TestBed.createComponent(ItineraryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
