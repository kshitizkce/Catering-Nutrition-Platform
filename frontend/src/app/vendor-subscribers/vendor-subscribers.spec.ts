import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSubscribers } from './vendor-subscribers';

describe('VendorSubscribers', () => {
  let component: VendorSubscribers;
  let fixture: ComponentFixture<VendorSubscribers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSubscribers],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSubscribers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
