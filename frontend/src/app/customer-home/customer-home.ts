import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { MenuService } from '../services/menu/menu';
import { VendorService } from '../services/vendor/vendor-service';
import { PreferenceService } from '../services/preference/preference.service';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-home.html',
  styleUrls: ['./customer-home.css']
})
export class CustomerHomeComponent {

  constructor(
  private router: Router,
  private menuService: MenuService,
  private userService: AuthService,
  private vendorService : VendorService,
    private preferenceService: PreferenceService,
    private cd: ChangeDetectorRef

) {}

preference: any;


  searchText: string = '';
  userEmail: string = '';

   vendors: any[] = [];
filteredVendors: any[] = [];


  ngOnInit() {
  this.initializeUser();
  this.loadVendors();
  this.loadPreference();
}

  // ✅ SEARCH
  onSearchChange() {
    this.filteredVendors = this.vendors.filter(v =>
    v.vendorName.toLowerCase().includes(this.searchText.toLowerCase())
  );
  }

  search() {
    this.onSearchChange();
  }

  // ✅ NAVIGATION FIXED
  goHome() {
    this.router.navigate(['/home']);
  }

  
  goToAccount() {
    this.router.navigate(['/profile']);
  }

  bookCatering() {
    this.router.navigate(['/book-catering']);
  }

  goToSubscription() {
    this.router.navigate(['/subscription']);
  }

  // ✅ VENDORS
  viewAllVendors() {
    this.router.navigate(['/vendors']);
  }

  viewVendor(v: any) {
  

  this.router.navigate(['/vendor-details', v.VendorId || v.vendorId]);
  }

  initializeUser() {
  const user = this.userService.getUser();

  if (user) {
    this.userEmail = user.email;
  }

  if (!user) {
    console.error("User not logged in");
    return;
  }

  const userId = user.userId;

  if (!userId) {
    console.error("User ID not found");
    return;
  }

  // ✅ set email for UI
  this.userEmail = user.email;
}

loadVendors() {
  this.menuService.getVendors().subscribe({
    next: (res: any[]) => {

      // ✅ sort by rating DESC
      const sorted = res.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      // ✅ take top 5
      this.vendors = sorted;
      this.filteredVendors = sorted.slice(0, 5);

      this.cd.detectChanges(); // trigger UI update
    },
    error: err => console.error(err)
  });
}

goToCart() {
  this.router.navigate(['/cart']);
}

goToSubscriptionCart() {

  const user = this.userService.getUser();
  const userId = user.userId;

  this.vendorService.getSubscriber(userId)
    .subscribe({
      next: (res: any) => {

        if (res && res.userId) {
          // ✅ Has subscription → go to subscription cart
          this.router.navigate(['/subscriptioncart']);
        } else {
          alert("❌ No active meal subscription found");
        }

      },
      error: () => {
        alert("❌ You don't have a meal subscription");
      }
    });
}

loadPreference() {
  const user = this.userService.getUser();
  if (!user) return;

  this.preferenceService.getWeeklyPreference(user.userId).subscribe({
    next: res => {
      this.preference = res;
      this.cd.detectChanges(); 
    }
  });
}

}