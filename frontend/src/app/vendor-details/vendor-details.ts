import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
selector:'app-vendor-details',
standalone:true,
imports:[CommonModule],
templateUrl:'./vendor-details.html',
styleUrls:['./vendor-details.css']
})
export class VendorDetailsComponent{

constructor(private route:ActivatedRoute, public router:Router){}

vendorName:string="";

menu:any[]=[];

ngOnInit(){

this.vendorName = this.route.snapshot.paramMap.get('name') || "";

this.loadMenu();

}

loadMenu(){

const vendorMenus:any = {

"Healthy Bites Catering":[
{
name:"Grilled Chicken Bowl",
calories:450,
protein:"35g",
carbs:"40g",
fat:"12g",
price:14,
image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
},
{
name:"Protein Power Salad",
calories:380,
protein:"32g",
carbs:"25g",
fat:"10g",
price:13,
image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
}
],

"Thunder Bay Gourmet":[
{
name:"Steak Pasta",
calories:650,
protein:"40g",
carbs:"60g",
fat:"22g",
price:18,
image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141"
},
{
name:"Creamy Mushroom Pasta",
calories:520,
protein:"20g",
carbs:"65g",
fat:"18g",
price:16,
image:"https://images.unsplash.com/photo-1473093226795-af9932fe5856"
}
],

"Lakehead Catering":[
{
name:"Grilled Salmon Plate",
calories:520,
protein:"38g",
carbs:"30g",
fat:"20g",
price:19,
image:"https://images.unsplash.com/photo-1504674900247-0877df9cc836"
},
{
name:"Tilapia Veg Plate",
calories:480,
protein:"34g",
carbs:"28g",
fat:"18g",
price:17,
image:"https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642"
}
],

"Northern Feast Catering":[
{
name:"BBQ Mixed Grill",
calories:720,
protein:"50g",
carbs:"35g",
fat:"30g",
price:22,
image:"https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
},
{
name:"Chicken Skewer Plate",
calories:600,
protein:"45g",
carbs:"30g",
fat:"25g",
price:20,
image:"https://images.unsplash.com/photo-1604908176997-431b3bce66d9"
}
]

};

this.menu = vendorMenus[this.vendorName] || [];

}

}