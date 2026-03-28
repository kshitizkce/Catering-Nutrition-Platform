import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMealCatering } from './admin-meal-catering';

describe('AdminMealCatering', () => {
  let component: AdminMealCatering;
  let fixture: ComponentFixture<AdminMealCatering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMealCatering],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMealCatering);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
