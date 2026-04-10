import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { VendorService } from '../services/vendor/vendor-service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, NavbarComponent,FormsModule],
  templateUrl: './meal-subscription.html',
  styleUrls: ['./meal-subscription.css']
})
export class SubscriptionComponent {

  constructor(public router: Router, private userService: AuthService, private vendorService:VendorService) {}

  userEmail: string = '';
  userId!: number;

  subscriptionPrice: number = 0;

  selectedPlan: string = "";
  selectedMeals: number = 0;
  selectedTime: string = "";

  ngOnInit() {
    const user = this.userService.getUser();
    if (user) {
      this.userEmail = user.email;
      this.userId = user.userId;
    }
  }

  selectPlan(plan: string) {
  this.selectedPlan = plan;

  // recalc price if meals already selected
  if (this.selectedMeals) {
    this.selectMeals(this.selectedMeals);
  }
}

  selectMeals(meals: number) {
  this.selectedMeals = meals;

  // 💰 PRICE CALCULATION
  if (this.selectedPlan === 'weekly') {
    this.subscriptionPrice = meals * 10; // example: $10 per meal
  } else if (this.selectedPlan === 'monthly') {
    this.subscriptionPrice = meals * 9; // discount
  }
}
proceedToCheckout() {

  if (!this.selectedPlan || !this.selectedMeals || !this.selectedTime) {
    alert("Please select plan, meals and time");
    return;
  }

  const data = {
    isSubscription: true,
    plan: this.selectedPlan,
    meals: this.selectedMeals,
    deliveryTime: this.selectedTime,
    amount: this.subscriptionPrice
  };

  // ✅ SAVE IN SESSION
  sessionStorage.setItem("subscriptionData", JSON.stringify(data));

  this.router.navigate(['/checkout']);
}
}  
