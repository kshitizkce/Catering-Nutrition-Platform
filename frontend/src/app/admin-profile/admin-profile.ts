import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../services/vendor/vendor-service';
import {AdminCustomerService } from '../services/admindashboard/admin-customer';
import { AuthService } from '../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {

  constructor(
    private adminService :AdminCustomerService,
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  userId!: number;
  settings: any = {
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    status: ''
  };

  ngOnInit() {
    const user = this.authService.getUser();

    if (!user || !user.userId) {
      alert("User not logged in");
      this.router.navigate(['/login']);
      return;
    }

    this.userId = user.userId;

    this.vendorService.getVendorProfile(this.userId)
      .subscribe({
        next: (data: any) => {
          this.settings.ownerName = data.ownerName;
          this.settings.email = data.email;
          this.settings.phone = data.phone;
          this.settings.role = data.role;
          this.settings.status = data.status;
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.error?.message || "Failed to load admin data");
          this.cdr.detectChanges();
        }
      });
  }

  saveSettings() {

   const payload = {
    userId: this.userId,
    ownerName: this.settings.ownerName,
    email: this.settings.email,
    phone: this.settings.phone,
    password: this.settings.password || undefined
  };

  this.adminService.updateProfile(payload).subscribe({
    next: (res:any) => alert(res.message),
    error: (err) => alert(err.error?.message || "Failed to update profile")
  });
  }

  cancel() {
      this.router.navigate(['/admin-dashboard']);

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
}