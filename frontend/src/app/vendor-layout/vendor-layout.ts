import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth';
import { VendorService } from '../services/vendor/vendor-service';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './vendor-layout.html',
  styleUrls: ['./vendor-layout.css']
})
export class VendorLayoutComponent implements OnInit {

  isOpen: boolean = false;
  isMealCateringEnabled = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private vendorService: VendorService
  ) {}

  ngOnInit() {

    // ✅ Get logged-in user
    const user = this.authService.getUser();

    // ✅ Check Meal Catering Status
    if (user?.userId) {
      this.vendorService.getVendorProfile(user.userId).subscribe({
        next: (res: any) => {
          this.isMealCateringEnabled = res.mealCateringStatus === 1;

          // safe UI update
          setTimeout(() => this.cdr.detectChanges());
        },
        error: err => console.error(err)
      });
    }

    // ✅ Existing logic (UNCHANGED)
    const savedStatus = localStorage.getItem('restaurantOpen');

    if (savedStatus !== null) {
      this.isOpen = savedStatus === 'true';
    }

    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  toggleRestaurant() {
    this.isOpen = !this.isOpen;

    localStorage.setItem('restaurantOpen', String(this.isOpen));

    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }
}