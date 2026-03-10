import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealSubscription } from './meal-subscription';

describe('MealSubscription', () => {
  let component: MealSubscription;
  let fixture: ComponentFixture<MealSubscription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealSubscription],
    }).compileComponents();

    fixture = TestBed.createComponent(MealSubscription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
