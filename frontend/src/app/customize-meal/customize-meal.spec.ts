import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeMeal } from './customize-meal';

describe('CustomizeMeal', () => {
  let component: CustomizeMeal;
  let fixture: ComponentFixture<CustomizeMeal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeMeal],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeMeal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
