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

  deleteVendor(vendorId: number) {
  if (!confirm('Are you sure you want to delete this vendor?')) return;

  this.vendorService.deleteVendor(vendorId).subscribe({
    next: () => {
      // remove from UI
      this.vendors = this.vendors.filter(v => v.vendorId !== vendorId);
      alert('Vendor deleted successfully');
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      alert('Failed to delete vendor');
    }
  });
}

getVendorFileUrl(fileName: string): string {
  // returns full URL to backend file
  return this.vendorService.getVendorFileUrlfromApi(fileName);
}

  approve(v: Vendor) {
  this.vendorService.approveVendor(v.vendorId).subscribe({
    next: (updatedVendor) => {
      v.status = updatedVendor.status; // update table immediately
      alert(`Vendor "${v.vendorName}" is now Verified`);
            this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      alert('Failed to approve vendor');
    }
  });
}

reject(v: Vendor) {
  this.vendorService.rejectVendor(v.vendorId).subscribe({
    next: async (updatedVendor) => {
      // update status in table
      const index = this.vendors.findIndex(x => x.vendorId === v.vendorId);
      if (index !== -1) this.vendors[index] = { ...updatedVendor };
      this.cdr.detectChanges();

      // ask admin to type message
      const message = prompt(
        `Type the email message for ${v.vendorName} (${v.vendorEmail}):`,
        "Your verification for seller is rejected due to ... " // default message
      );

      if (message) {
        this.vendorService.sendVendorEmail({
  toEmail: v.vendorEmail,
  subject: "Seller Verification Rejected",
  message
}).subscribe({
  next: (res: string) => {
    alert(res); // Will show "Email sent successfully"
  },
  error: (err) => {
    console.error(err);
    alert("Failed to send email");
  }
});
      }
    },
    error: (err) => {
      console.error(err);
      alert('Failed to reject vendor');
    }
  });
}
}