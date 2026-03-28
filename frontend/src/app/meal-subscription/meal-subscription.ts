import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-subscription.html',
  styleUrls: ['./meal-subscription.css']
})
export class SubscriptionComponent {

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  selectedPlan: string = "";
  selectedMeals: number = 0;

  selectPlan(plan: string) {
    this.selectedPlan = plan;
    this.cdr.detectChanges();
  }

  selectMeals(meals: number) {
    this.selectedMeals = meals;
    this.cdr.detectChanges();
  }

}