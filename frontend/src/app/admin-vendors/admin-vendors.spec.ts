import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVendors } from './admin-vendors';

describe('AdminVendors', () => {
  let component: AdminVendors;
  let fixture: ComponentFixture<AdminVendors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVendors],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVendors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
