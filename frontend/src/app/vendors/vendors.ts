import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
selector:'app-vendors',
standalone:true,
imports:[CommonModule],
templateUrl:'./vendors.html',
styleUrls:['./vendors.css']
})
export class VendorsComponent{

constructor(public router:Router){}

vendors = [

{
name:"Healthy Bites Catering",
category:"Healthy & Organic",
rating:"4.8",
description:"Fresh organic catering for events and corporate meals.",
image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
},

{
name:"Thunder Bay Gourmet",
category:"International Cuisine",
rating:"4.7",
description:"Premium catering services for weddings and parties.",
image:"https://images.unsplash.com/photo-1504674900247-0877df9cc836"
},

{
name:"Lakehead Catering",
category:"Local Favorites",
rating:"4.6",
description:"Traditional Thunder Bay catering with local ingredients.",
image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
},

{
name:"Northern Feast Catering",
category:"Buffet Catering",
rating:"4.5",
description:"Large scale catering for weddings and corporate events.",
image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141"
},

{
name:"Superior Events Catering",
category:"Luxury Catering",
rating:"4.9",
description:"Luxury catering service for premium events.",
image:"https://images.unsplash.com/photo-1473093226795-af9932fe5856"
}

];

viewVendor(name:string){
this.router.navigate(['/vendor', name]);
}

}