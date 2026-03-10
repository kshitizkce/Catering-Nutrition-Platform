import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
selector: 'app-menu',
standalone: true,
imports: [CommonModule],
templateUrl: './menu.html',
styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

menuItems:any[] = [];

constructor(private router: Router) {}

ngOnInit(){

this.menuItems = [

{
name:"Grilled Chicken Bowl",
category:"Chicken",
price:14,
description:"High protein grilled chicken with rice and vegetables",
image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
},

{
name:"Teriyaki Chicken Meal",
category:"Chicken",
price:15,
description:"Grilled chicken with teriyaki sauce and steamed rice",
image:"https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
},

{
name:"Vegan Buddha Bowl",
category:"Vegan",
price:12,
description:"Quinoa, roasted chickpeas, avocado and greens",
image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
},

{
name:"Tofu Stir Fry",
category:"Vegan",
price:13,
description:"Stir fried tofu with vegetables and soy glaze",
image:"https://images.unsplash.com/photo-1604908176997-431b3bce66d9"
},

{
name:"Salmon Protein Plate",
category:"Fish",
price:18,
description:"Fresh salmon with sweet potato and broccoli",
image:"https://images.unsplash.com/photo-1504674900247-0877df9cc836"
},

{
name:"Grilled Tilapia Plate",
category:"Fish",
price:17,
description:"Tilapia fillet with quinoa and roasted vegetables",
image:"https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642"
},

{
name:"Low Carb Steak Bowl",
category:"Low Carb",
price:20,
description:"Grilled steak with roasted vegetables and avocado",
image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141"
},

{
name:"Keto Chicken Salad",
category:"Low Carb",
price:16,
description:"Grilled chicken with avocado and greens",
image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
},

{
name:"Vegetarian Pasta",
category:"Vegetarian",
price:13,
description:"Whole wheat pasta with roasted vegetables",
image:"https://images.unsplash.com/photo-1473093226795-af9932fe5856"
},

{
name:"Paneer Power Bowl",
category:"Vegetarian",
price:14,
description:"Indian style paneer with brown rice and vegetables",
image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398"
}

];

}

selectMeal(item:any){
alert(item.name + " selected for your plan");
}

goHome(){
this.router.navigate(['/home']);
}

goMenu(){
this.router.navigate(['/menu']);
}

goAccount(){
this.router.navigate(['/profile']);
}

}