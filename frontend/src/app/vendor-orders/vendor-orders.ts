import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-orders.html',
  styleUrls: ['./vendor-orders.css']
})
export class VendorOrdersComponent implements OnInit {

  orders: any[] = [];
vendorId: number = 0; // default
  constructor(private vendorService: VendorService,
    private authService: AuthService)    
    {}

 ngOnInit(): void {
  const user = this.authService.getUser();

  if (!user) {
    console.error("User not logged in");
    return;
  }

  const userId = user.userId;

  if (!userId) {
    console.error("User ID not found");
    return;
  }

  // ✅ Step 1: get vendorId from backend
  this.vendorService.getVendorByUserId(userId).subscribe({
    next: (vendor: any) => {
      this.vendorId = vendor.vendorId;

      if (!this.vendorId) {
        console.error("Vendor ID not found");
        return;
      }

      // ✅ Step 2: NOW load orders
      this.loadOrders();
    },
    error: (err) => {
      console.error("Failed to fetch vendor:", err);
    }
  });
}

  loadOrders() {
    this.vendorService.getOrders(this.vendorId).subscribe({
      next: (res: any) => {
        // Add UI helper property for expand/collapse
        this.orders = res.map((o: any) => ({
          ...o,
          showItems: false
        }));
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }

  toggleItems(order: any) {
    order.showItems = !order.showItems;
  }
}