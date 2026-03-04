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

  userEmail: string | null = '';

  constructor(private router: Router) {
    this.userEmail = localStorage.getItem('userEmail');
  }

  bookCatering(){
    alert('Booking page coming soon');
  }

  goToSubscription(){
    alert('Subscription page coming soon');
  }

  viewCaterer(name:string){
    alert('Viewing ' + name);
  }

  goToAccount(){
    this.router.navigate(['/profile']);
  }

}