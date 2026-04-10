import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscriptioncart } from './subscriptioncart';

describe('Subscriptioncart', () => {
  let component: Subscriptioncart;
  let fixture: ComponentFixture<Subscriptioncart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subscriptioncart],
    }).compileComponents();

    fixture = TestBed.createComponent(Subscriptioncart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
