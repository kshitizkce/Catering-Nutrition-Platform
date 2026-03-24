import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminVendorService, Vendor } from '../services/admindashboard/admin-vendor';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-vendors.html',
  styleUrls: ['./admin-vendors.css']
})
export class AdminVendorsComponent implements OnInit {

  searchText = '';
  selectedFilter = 'All';
  vendors: Vendor[] = [];
  loading = false;

  constructor(
    private router: Router, 
    private vendorService: AdminVendorService,
    private cdr: ChangeDetectorRef  // ✅ inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading = true;
    this.vendorService.getAllVendors().subscribe({
      next: vendors => {
        this.vendors = vendors;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ force view update
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ ensure view updates even on error
      }
    });
  }

  get filteredVendors() {
    return this.vendors.filter(v =>
      (this.selectedFilter === 'All' || v.status === this.selectedFilter) &&
      v.vendorName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  openVendor(vendor: Vendor) {
    this.router.navigate(['/admin-vendor-details', vendor.vendorId]);
  }

  approve(v: Vendor) { v.status = 'Approved'; }
  reject(v: Vendor) { v.status = 'Rejected'; }
}