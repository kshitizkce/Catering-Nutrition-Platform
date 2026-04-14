import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { MenuService } from '../services/menu/menu';
import { VendorService } from '../services/vendor/vendor-service';
import { PreferenceService } from '../services/preference/preference.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { SubscriptionCartService } from '../services/cart/customize-cart-service';



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
    private cartService: CartService,
private subscriptionCartService: SubscriptionCartService,
    private cd: ChangeDetectorRef,
      private ngZone: NgZone


) {}

preference: any;


  searchText: string = '';
  userEmail: string = '';

   vendors: any[] = [];
filteredVendors: any[] = [];

currentIndex = 0;


slides = [
  {
    image: 'banner1.jpg',
    title: 'Fresh & Healthy Meals',
    subtitle: 'Delivered straight to your door'
  },
  {
    image: 'banner2.jpg',
    title: 'Custom Meal Plans',
    subtitle: 'Perfect for your lifestyle'
  },
  {
    image: 'banner3.jpg',
    title: 'Trusted Food Service with Catering Services',
    subtitle: 'For home & business events'
  }
];


  ngOnInit() {
  this.initializeUser();
  this.loadVendors();
  this.loadPreference();

  this.ngZone.runOutsideAngular(() => {
    setInterval(() => {
      this.ngZone.run(() => {
        this.currentIndex =
          (this.currentIndex + 1) % this.slides.length;

        this.cd.markForCheck();
      });
    }, 4000);
  });
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

private getParsedHours(v: any): any[] {
  try {
    return JSON.parse(v.businessHours || '[]');
  } catch {
    return [];
  }
}

private getTodayName(): string {
  return new Date().toLocaleString('en-US', { weekday: 'long' });
}

private getCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

// ✅ OPEN / CLOSED
isVendorOpen(v: any): boolean {
  const hours = this.getParsedHours(v);
  const today = this.getTodayName();
  const now = this.getCurrentTime();

  const todayData = hours.find(h => h.name === today);

  if (!todayData) return false;

  return now >= todayData.open && now <= todayData.close;
}

// ✅ TODAY HOURS
getTodayHours(v: any): string {
  const hours = this.getParsedHours(v);
  const today = this.getTodayName();

  const todayData = hours.find(h => h.name === today);

  if (!todayData) return 'No hours available';

  return `${today}: ${todayData.open} - ${todayData.close}`;
}

// ✅ NEXT OPEN TIME
getNextOpenTime(v: any): string {
  const hours = this.getParsedHours(v);
  const today = this.getTodayName();
  const now = this.getCurrentTime();

  const todayData = hours.find(h => h.name === today);

  if (todayData && now < todayData.open) {
    return `${todayData.open} today`;
  }

  const daysOrder = [
    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
  ];

  const todayIndex = daysOrder.indexOf(today);

  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDayName = daysOrder[nextDayIndex];

    const nextDayData = hours.find(h => h.name === nextDayName);

    if (nextDayData) {
      return `${nextDayName} at ${nextDayData.open}`;
    }
  }

  return 'Not available';
}

reorderToCart(pref: any) {

  pref.items.forEach((item: any) => {

    const payload = {
      userId: this.userService.getUser().userId,
      vendorId: pref.vendorId,
      menuItemId: item.menuItemId,
      unitPrice: item.price ?? 0,
      quantity: 1
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => {},
      error: err => console.error(err)
    });

  });

  alert("✅ Items added to cart");
}
reorderToSubscription(pref: any) {

  const user = this.userService.getUser();

  this.vendorService.getSubscriber(user.userId)
    .subscribe((sub: any) => {

      if (!sub || sub.status !== "Active") {
        alert("❌ No active subscription");
        return;
      }

      // ✅ Set meal limit
      this.subscriptionCartService.setMealsLimit(sub.mealsPerCycle);

      pref.items.forEach((item: any) => {

        // 🔥 RANDOM CALORIES (400–800)
        const calories = Math.floor(Math.random() * (800 - 400 + 1)) + 400;

        // 🔥 PROTEIN (calories / 4)
        const protein = Math.round(calories / 4);

        this.subscriptionCartService.addToCart({
          menuItemId: item.menuItemId,
          name: item.itemName,
          quantity: 1,
          vendorId: pref.vendorId,
          imageUrl: item.imageUrl,

          // ✅ SMART DEFAULTS
          customCalories: calories,
          customProtein: protein,
          preparationStyle: 'Standard'
        });

      });

      this.router.navigate(['/subscriptioncart']);

    });
}
}