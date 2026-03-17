import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSettings } from './vendor-settings';

describe('VendorSettings', () => {
  let component: VendorSettings;
  let fixture: ComponentFixture<VendorSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
