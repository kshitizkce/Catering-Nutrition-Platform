import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../services/menu/menu';
import { VendorService } from '../services/vendor/vendor-service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../services/auth/auth';
import { CartService } from '../services/cart/cart.service';
import { SubscriptionCartService } from '../services/cart/customize-cart-service';

@Component({
  selector: 'app-vendor-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './vendor-details.html',
  styleUrls: ['./vendor-details.css']
})
export class VendorDetailsComponent implements OnInit {

  vendorId!: number;
  vendorName: string = '';
  menu: any[] = [];
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  isSubscribed: boolean = false;
  userEmail: string = '';
  userId!: number;

  // ✅ NEW
  mealsLimit = 0;
  currentCount = 0;
  hasSubscriptionRecord = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private vendorService: VendorService,
    private userService: AuthService,
    private cartService: CartService,
    private subCartService: SubscriptionCartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.vendorId = Number(this.route.snapshot.paramMap.get('vendorId'));

    this.initializeUser();
    this.checkSubscription();

    this.loadCategories();
    this.loadAllMenu();
  }

  initializeUser() {
    const user = this.userService.getUser();

    if (user) {
      this.userEmail = user.email;
      this.userId = user.userId;
    }
  }

  loadAllMenu() {
    this.menuService.getVendorMenu(this.vendorId).subscribe({
      next: (res: any[]) => {
        this.menu = res.sort((a, b) => b.rating - a.rating);
        this.selectedCategoryId = 0;
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  loadCategories() {
    this.menuService.getCategories().subscribe({
      next: (res: any[]) => {
        this.categories = [
          { categoryId: 0, categoryName: 'All' },
          ...res
        ];
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;

    if (categoryId === 0) {
      this.loadAllMenu();
      return;
    }

    this.menuService.getMenuByVendorAndCategoryApi(this.vendorId, [categoryId])
      .subscribe({
        next: (res: any[]) => {
          this.menu = res.sort((a, b) => b.rating - a.rating);
          this.cdr.detectChanges();
        },
        error: err => console.error(err)
      });
  }

checkSubscription() {

  if (!this.userId) {
    this.isSubscribed = false;
    this.hasSubscriptionRecord = false; // ✅ NEW
    return;
  }

  this.vendorService.getSubscriber(this.userId).subscribe({
    next: (res: any) => {

      console.log("SUBSCRIBER:", res);

      // ✅ CHECK RECORD EXISTS
      this.hasSubscriptionRecord = !!res;

      // ✅ ACTIVE CHECK
      this.isSubscribed = res?.status === 'Active';

      // ✅ LIMIT + CURRENT COUNT
      this.mealsLimit = res?.mealsPerCycle || 0;
      this.currentCount = this.subCartService.getItems().length;

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);

      this.isSubscribed = false;
      this.hasSubscriptionRecord = false; // ✅ NEW

      this.cdr.detectChanges();
    }
  });
}
  goBack() {
    this.router.navigate(['/vendors']);
  }

  // ✅ FIXED (LIMIT + NAVIGATION)
  goToCustomize(item: any) {

  const total = this.subCartService.getTotalQuantity();
  const limit = this.subCartService.getMealsLimit();

  if (limit && total >= limit) {
    alert("Meal plan limit reached");
    return;
  }

  this.router.navigate(['/customize-meal', item.menuItemId], {
    state: item
  });
}

  orderNow(item: any) {

    const payload = {
      userId: this.userId,
      menuItemId: item.menuItemId,
      quantity: 1,
      unitPrice: item.price ?? 0
    };

    this.cartService.addToCart(payload).subscribe({
      next: () => alert("Added to cart 🛒"),
      error: () => alert("Add failed")
    });
  }
}