import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../services/vendor/vendor-service';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-orders.html',
  styleUrls: ['./vendor-orders.css']
})
export class VendorOrdersComponent implements OnInit {

  orders: any[] = [];
  vendorId = 5; // ⚠️ Replace with actual logged-in vendor ID

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.loadOrders();
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