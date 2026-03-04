import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  isLogin = true;

  email: string = '';
  password: string = '';
  fullName: string = '';

  constructor(private router: Router) {}

  switchToLogin() {
    this.isLogin = true;
  }

  switchToSignup() {
    this.isLogin = false;
  }

  // LOGIN
  login() {

    if (!this.email || this.email.trim() === '') {
      alert('Please enter email');
      return;
    }

    // ADMIN LOGIN
    if (this.email === 'admin@smart.com') {

      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('userName', 'Admin');

      this.router.navigate(['/admin-profile']);
      return;
    }

    const role = localStorage.getItem('userRole');

    localStorage.setItem('userEmail', this.email);

    if (role === 'vendor') {

      this.router.navigate(['/vendor-profile']);

    } else {

      // default customer login
      this.router.navigate(['/home']);

    }

  }

  // SIGNUP AS CUSTOMER
  signupAsCustomer() {

    if (!this.email || this.email.trim() === '') {
      alert('Please enter email');
      return;
    }

    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('userRole', 'customer');

    // store name for profile page
    localStorage.setItem('userName', this.fullName || 'Customer');

    this.router.navigate(['/home']);
  }

  // SIGNUP AS VENDOR
  signupAsVendor() {

    if (!this.email || this.email.trim() === '') {
      alert('Please enter email');
      return;
    }

    localStorage.setItem('userEmail', this.email);
    localStorage.setItem('userRole', 'vendor');

    // store name
    localStorage.setItem('userName', this.fullName || 'Vendor');

    this.router.navigate(['/vendor-profile']);
  }

}