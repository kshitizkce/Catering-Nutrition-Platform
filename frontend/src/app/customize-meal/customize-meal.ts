import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionCartService } from '../services/cart/customize-cart-service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../services/auth/auth';
import { VendorService } from '../services/vendor/vendor-service';
import { MenuService } from '../services/menu/menu';

@Component({
  selector: 'app-customize-meal',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './customize-meal.html',
  styleUrls: ['./customize-meal.css']
})
export class CustomizeMealComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: SubscriptionCartService,
    private auth: AuthService,
    private vendorService: VendorService,
    private menuService: MenuService
  ) {}

  meal: any;
  userId!: number;
    userEmail = '';


  targetCalories = 520;
  targetProtein = 42;
  style = 'Grilled Chicken';
  portion = 1;

  mealsLimitLoaded = false;

  ngOnInit() {

    this.initializeUser();
    const user = this.auth.getUser();
    this.userId = user.userId;

    const navData = history.state;
    const menuItemId = Number(this.route.snapshot.paramMap.get('id'));

    // fast load
    if (navData && navData.menuItemId) {
      this.setMeal(navData);
    }

    // API load
    this.menuService.getMenuItemById(menuItemId)
      .subscribe((data: any) => {
        this.setMeal(data);
      });

    // subscription
    this.vendorService.getSubscriber(this.userId)
      .subscribe((res: any) => {
        if (res) {
          this.cartService.setMealsLimit(res.mealsPerCycle);
          this.mealsLimitLoaded = true;
        }
      });
  }

  setMeal(data: any) {
    this.meal = {
      ...data,
      cal: data.calories || 500,
      protein: data.protein || 40,
      carbs: 50,
      fat: 10
    };

    this.targetCalories = this.meal.cal;
    this.targetProtein = this.meal.protein;
  }

  initializeUser() {
    const user = this.auth.getUser();
    if (!user) return;

    this.userId = user.userId;
    this.userEmail = user.email;
  }


  get updated() {
    if (!this.meal) {
      return { cal: 0, protein: 0, carbs: 0, fat: 0, price: 0 };
    }

    this.portion = this.targetCalories / this.meal.cal;

    return {
      cal: Math.round(this.targetCalories),
      protein: Math.round(this.targetProtein),
      carbs: Math.round(this.meal.carbs * this.portion),
      fat: Math.round(this.meal.fat * this.portion),
      price: +(this.meal.price * this.portion).toFixed(2)
    };
  }

  reset() {
    this.targetCalories = this.meal.cal;
    this.targetProtein = this.meal.protein;
  }

  goBack() {
    this.router.navigate(['/vendor-details', this.meal.vendorId]);
  }

  addToCart() {

    const success = this.cartService.addToCart({
      menuItemId: this.meal.menuItemId,
      vendorId: this.meal.vendorId,

      // ✅ FIX 1
      name: (this.meal.itemName || this.meal.name || 'Meal') + ' - ' + this.style,

      unitPrice: this.updated.price,

      // ✅ FIX 3
      imageUrl: this.meal.imageUrl,

      customCalories: this.updated.cal,
      customProtein: this.updated.protein,
      preparationStyle: this.style,
      quantity: 1
    });

    console.log("ADDED?", success);
    console.log("CART NOW:", this.cartService.getItems());

    if (!this.validateNutrition()) return;

    if (success) {
      alert("Added to subscription cart");
      this.router.navigate(['/vendor-details', this.meal.vendorId]);
    }
  }

  validateNutrition() {

  if (this.targetCalories < 300 || this.targetCalories > 900) {
    alert("Calories must be between 300 and 900 per meal");
    return false;
  }

  if (this.targetProtein < 20 || this.targetProtein > 60) {
    alert("Protein must be between 20g and 60g per meal");
    return false;
  }

  return true;
}
}