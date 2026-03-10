import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDto, LoginDto } from '../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  isLogin = true;

  fullName = '';
  email = '';
  phone = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  switchToLogin() { this.isLogin = true; }
  switchToSignup() { this.isLogin = false; }

  login() {
    if (!this.email || !this.password) { alert("Email and password required"); return; }

    const dto: LoginDto = { email: this.email, password: this.password };

    this.authService.login(dto).subscribe({
      next: (res: any) => {
        localStorage.setItem("userEmail", res.email);
        localStorage.setItem("userRole", res.role);
        localStorage.setItem("userName", res.fullName);

        if (res.role === "Admin") this.router.navigate(['/admin-profile']);
        else if (res.role === "Vendor") this.router.navigate(['/vendor-profile']);
        else this.router.navigate(['/home']);
      },
      error: (err: any) => alert(err.error || "Login failed")
    });
  }

  signup(roleType: 'customer' | 'vendor') {
    if (!this.fullName || !this.email || !this.password || !this.phone) {
      alert("All fields required"); return;
    }

    const dto: RegisterDto = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      roleId: roleType === 'customer' ? 1 : 2,
      subscriptionTypeId: 1
    };

    this.authService.register(dto, roleType).subscribe({
      next: (res: any) => {
        alert("Registration successful");

        localStorage.setItem("userEmail", this.email);
        localStorage.setItem("userRole", roleType);
        localStorage.setItem("userName", this.fullName);

        if (roleType === 'customer') this.router.navigate(['/home']);
        else this.router.navigate(['/vendor-profile']);
      },
      error: (err: any) => alert(err.error || "Registration failed")
    });
  }

  signupAsCustomer() { this.signup('customer'); }
  signupAsVendor() { this.signup('vendor'); }
}