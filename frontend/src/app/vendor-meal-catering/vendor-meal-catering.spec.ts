import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMealCatering } from './vendor-meal-catering';

describe('VendorMealCatering', () => {
  let component: VendorMealCatering;
  let fixture: ComponentFixture<VendorMealCatering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMealCatering],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMealCatering);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
