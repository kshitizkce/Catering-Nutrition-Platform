import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  isLogin = true;

  switchToLogin() {
    this.isLogin = true;
  }

  switchToSignup() {
    this.isLogin = false;
  }

  login() {
    alert("Login clicked");
  }

  signupAsCustomer() {
    alert("Signup as Customer");
  }

  signupAsVendor() {
    alert("Signup as Vendor");
  }

}