import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-admin-profile',
standalone: true,
imports: [CommonModule],
templateUrl: './admin-profile.html',
styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {

activePage:string = 'home';

cateringRequests:any[] = [];

ngOnInit(){

const stored = localStorage.getItem("cateringRequests");

if(stored){
this.cateringRequests = JSON.parse(stored);
}

}

setPage(page:string){
this.activePage = page;
}

/* ===== REQUEST ACTIONS ===== */

approveRequest(index:number){

this.cateringRequests[index].status = "Approved";

localStorage.setItem(
"cateringRequests",
JSON.stringify(this.cateringRequests)
);

}

rejectRequest(index:number){

this.cateringRequests[index].status = "Rejected";

localStorage.setItem(
"cateringRequests",
JSON.stringify(this.cateringRequests)
);

}

deleteRequest(index:number){

this.cateringRequests.splice(index,1);

localStorage.setItem(
"cateringRequests",
JSON.stringify(this.cateringRequests)
);

}

/* ===== EXISTING BUTTON FUNCTIONS ===== */

requestInfo(){
alert("Vendor information request sent.");
}

saveSettings(){
alert("Settings saved successfully.");
}

logout(){
localStorage.clear();
window.location.href = "/";
}

}