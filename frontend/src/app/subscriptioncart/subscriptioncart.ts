import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionCartService } from '../services/cart/customize-cart-service';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-subscription-cart',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './subscriptioncart.html',
  styleUrls: ['./subscriptioncart.css']
})
export class SubscriptionCartComponent implements OnInit {

  items: any[] = [];
  mealsLimit = 0;
  userId!: number;
   userEmail = '';

  constructor(
    public cartService: SubscriptionCartService,
    private vendorService: VendorService,
    private auth: AuthService,
    private router: Router,
        private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef   // ✅ ADD THIS
  ) {}

  ngOnInit() {
    this.initializeUser();

    const user = this.auth.getUser();
    this.userId = user.userId;

    // ✅ LOAD CART
    this.loadCart();

    // ✅ LOAD SUBSCRIPTION
    this.vendorService.getSubscriber(this.userId)
      .subscribe((res: any) => {

        console.log("SUBSCRIBER:", res);

        if (res) {
          this.mealsLimit = res.mealsPerCycle || 0;
          this.cartService.setMealsLimit(this.mealsLimit);
        }

        this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
      });
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // ✅ CENTRALIZED LOAD (IMPORTANT)
  loadCart() {
    this.items = this.cartService.getItems();

    console.log("LOADED CART:", this.items);

    this.cdr.detectChanges(); // ✅ FORCE UI UPDATE
  }

  // ✅ REMOVE ITEM (FIXED UI REFRESH)
  remove(i: number) {
    this.cartService.remove(i);
    this.loadCart(); // ✅ ALWAYS RELOAD
  }

  goBack() {
    if (this.items.length > 0) {
      this.router.navigate(['/vendor-details', this.items[0].vendorId]);
    } else {
      this.router.navigate(['/vendors']);
    }
  }


  initializeUser() {
    const user = this.auth.getUser();
    if (!user) return;

    this.userId = user.userId;
    this.userEmail = user.email;
  }

confirmOrder() {

  const total = this.cartService.getTotalQuantity();

  if (total !== this.mealsLimit) {
    alert(`Please select exactly ${this.mealsLimit} meals`);
    return;
  }

  const payload = {
    userId: this.userId,
    vendorId: this.items[0].vendorId,

    // ✅ FIX
    paymentIntentId: "subscription_payment_done", // or real Stripe ID

    items: this.items.map(i => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity,
      customCalories: i.customCalories,
      customProtein: i.customProtein,
      preparationStyle: i.preparationStyle
    }))
  };

  console.log("PAYLOAD:", payload); // 🔥 DEBUG

  this.cartService.confirmSubscriptionPlan(payload)
    .subscribe({
      next: () => {
        alert("✅ Saved to scheduler");
      },
      error: (err) => {
        console.error("ERROR:", err);
        alert("❌ Failed");
      }
    });
}
}