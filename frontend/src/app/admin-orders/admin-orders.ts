// admin-orders.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminCustomerService, Order } from '../services/admindashboard/admin-customer';
import { VendorService } from '../services/vendor/vendor-service';
import { FormsModule } from '@angular/forms';  // needed for ngModel

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  selectedFilter = 'All';
  loading = true;

  constructor(
    private service: AdminCustomerService,
    private vendorService: VendorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.service.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.map(o => ({
          ...o,
          expanded: false,
          statusId: this.getStatusId(o.orderStatus), // convert string to number for dropdown
          vendorId: o.vendorId ?? 0
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Filter orders based on selected status
  get filteredOrders() {
    if (this.selectedFilter === 'All') return this.orders;
    return this.orders.filter(o => o.orderStatus === this.selectedFilter);
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  // Update order status
  updateOrderStatus(order: any, statusId: string | number) {
    // convert dropdown value to number
    const newStatusId: number = Number(statusId);

    const payload = {
      deliveryAddress: order.deliveryAddress,
      totalAmount: order.totalAmount,
      orderStatusId: newStatusId,
      orderItems: []
    };

    // use vendorId from the order
    this.vendorService.updateOrder(order.vendorId, order.orderId, payload).subscribe(
      () => {
        // update UI immediately
        order.statusId = newStatusId;
        order.orderStatus = this.getStatusName(newStatusId); // readable string for table
        alert("Order updated");
        this.cdr.detectChanges();
      },
      err => {
        console.error(err);
        alert("Update failed");
      }
    );
  }

  // Map string orderStatus from API to numeric ID for dropdown
  getStatusId(status: string): number {
    switch (status.toLowerCase()) {
      case 'pending': return 2;
      case 'confirmed': return 3;
      case 'shipped': return 4;
      case 'delivered': return 5;
      case 'cancelled': return 1;
      default: return 0;
    }
  }

  // Map numeric ID to string for display
  getStatusName(statusId: number): string {
    switch (statusId) {
      case 1: return 'Cancelled';
      case 2: return 'Pending';
      case 3: return 'Confirmed';
      case 4: return 'Shipped';
      case 5: return 'Delivered';
      default: return 'Unknown';
    }
  }

  // Expand/collapse order details
  toggleOrder(order: Order) {
    order.expanded = !order.expanded;
    this.cdr.detectChanges();
  }
}