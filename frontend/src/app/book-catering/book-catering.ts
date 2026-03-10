import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
selector: 'app-book-catering',
standalone: true,
imports: [CommonModule],
templateUrl: './book-catering.html',
styleUrls: ['./book-catering.css']
})
export class BookCateringComponent {

constructor(public router: Router){}

eventType:string = "";
guests:number = 0;
date:string = "";
time:string = "";
location:string = "";
budget:string = "";

eventTypes = [
"Corporate Event",
"Wedding",
"Birthday Party",
"Conference",
"Other"
];

selectedEventType:string = "";

dietaryOptions = [
"Vegetarian",
"Vegan",
"Gluten-Free",
"Halal",
"Kosher",
"Nut-Free"
];

selectedDietary:string[] = [];

selectEvent(type:string){
this.selectedEventType = type;
}

toggleDiet(diet:string){

if(this.selectedDietary.includes(diet)){
this.selectedDietary =
this.selectedDietary.filter(d => d !== diet);
}else{
this.selectedDietary.push(diet);
}

}

submitRequest(){

const request = {
eventType:this.selectedEventType,
guests:this.guests,
date:this.date,
budget:this.budget,
status:"Pending"
};

let requests:any[] =
JSON.parse(localStorage.getItem("cateringRequests") || "[]");

requests.push(request);

localStorage.setItem(
"cateringRequests",
JSON.stringify(requests)
);

alert("Catering request submitted successfully!");

this.router.navigate(['/home']);

}

}