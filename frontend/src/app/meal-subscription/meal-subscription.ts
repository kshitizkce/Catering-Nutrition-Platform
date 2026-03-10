import { Component } from '@angular/core';
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

constructor(public router: Router){}

selectedPlan:string = "";
selectedMeals:number = 0;

selectPlan(plan:string){
this.selectedPlan = plan;
}

selectMeals(meals:number){
this.selectedMeals = meals;
}

}