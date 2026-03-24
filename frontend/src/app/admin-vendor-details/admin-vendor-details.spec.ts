import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendorDetails } from './admin-vendor-details';

describe('AdminVendorDetails', () => {
  let component: AdminVendorDetails;
  let fixture: ComponentFixture<AdminVendorDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVendorDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVendorDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
