import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.css']
})
export class VendorDashboardComponent implements OnInit, AfterViewInit {
  settings: any = {};

  vendor: any = {
    businessName: 'Vendor Name',
    email: '',
    phone: '',
    address: '',
    rating: 0
  };

  revenue: any = {
    weeklyRevenue: 0,
    weeklyOrders: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    avgOrderAmount: 0
  };

  orders: any[] = [];
  vendorId: number = 0;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef   // ✅ FIX: Injected properly
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();

    if (!user || !user.userId) {
      alert("User not logged in");
      return;
    }

    const userId = user.userId;

    this.vendorService.getVendorByUserId(userId).subscribe({
      next: (vendor: any) => {
        this.vendorId = vendor.vendorId;

        if (!this.vendorId) {
          console.error("Vendor ID not found!");
          return;
        }

        this.loadDashboard();
        this.loadVendorProfile();
      },
      error: (err) => {
        console.error("Failed to fetch vendor:", err);
        alert("Vendor not found");

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }

  // ✅ Safe lifecycle for manual change detection
  ngAfterViewInit() {
    setTimeout(() => this.cdr.detectChanges());
  }

  loadDashboard() {
    this.vendorService.getDashboard(this.vendorId).subscribe(
      (res: any) => {
        if (res.vendor) {
          this.vendor.businessName = res.vendor.businessName;
          this.vendor.email = res.vendor.email;
          this.vendor.phone = res.vendor.phone;
          this.vendor.address = res.vendor.address;
        }

        if (res.revenue) {
          this.revenue = res.revenue;
        }

        if (res.recentOrders) {
          this.orders = res.recentOrders;

          if (res.recentOrders.length > 0) {
            this.vendor.rating = res.recentOrders[0].vendorRating || 0;
          }
        }

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      (err) => {
        console.error(err);
        alert("Failed to fetch dashboard data");

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    );
  }

  loadVendorProfile() {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error("User ID not found!");
      return;
    }

    this.vendorService.getVendorProfile(userId).subscribe(
      (data: any) => {
        this.settings.logo = data.businessLogo
          ? 'https://a711-192-197-60-11.ngrok-free.app' + data.businessLogo
          : '';

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      (err) => {
        console.error(err);
        this.settings.logo = '';

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    );
  }

  updateOrderStatus(order: any, statusId: number) {
    const payload = {
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      orderStatusId: statusId,
      orderItems: []
    };

    this.vendorService.updateOrder(this.vendorId, order.orderId, payload).subscribe(
      () => {
        alert("Order updated");
        this.loadDashboard();

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      err => {
        console.error(err);
        alert("Update failed");

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    );
  }

  goBack() {
    window.location.href = "/role-select";
  }
}