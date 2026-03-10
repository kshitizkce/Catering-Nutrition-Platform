import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-customer-home',
standalone: true,
imports: [CommonModule],
templateUrl: './customer-home.html',
styleUrls: ['./customer-home.css']
})
export class CustomerHomeComponent {

constructor(private router: Router) {}

/* NAVIGATION FUNCTIONS */

goHome(){
this.router.navigate(['/home']);
}

goToMenu(){
this.router.navigate(['/menu']);
}

goToAccount(){
this.router.navigate(['/profile']);
}

viewAllVendors(){
this.router.navigate(['/vendors']);
}

/* PAGE BUTTONS */

bookCatering(){
this.router.navigate(['/book-catering']);
}

goToSubscription(){
this.router.navigate(['/subscription']);
}

viewCaterer(name:string){
alert("Viewing " + name);
}

}