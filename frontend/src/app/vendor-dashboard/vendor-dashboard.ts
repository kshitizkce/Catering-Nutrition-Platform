import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../services/vendor/vendor-service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.css']
})
export class VendorDashboardComponent implements OnInit {
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
  vendorId: number = 5;

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    this.loadDashboard();
    this.loadVendorProfile(); // ✅ Load logo and other profile info
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
      },
      (err) => {
        console.error(err);
        alert("Failed to fetch dashboard data");
      }
    );
  }

  loadVendorProfile() {
    const userId = 1021;
    this.vendorService.getVendorProfile(userId).subscribe(
      (data: any) => {
        this.settings.logo = data.businessLogo 
          ? 'http://localhost:5197' + data.businessLogo
          : '';
      },
      (err) => {
        console.error(err);
        this.settings.logo = '';
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
      },
      err => {
        console.error(err);
        alert("Update failed");
      }
    );
  }
}