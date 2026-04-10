import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../services/customerprofile/orderdelicerystatus';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./delivery-tracking.css']
})
export class DeliveryTrackingComponent implements OnInit {
  order: any = null;
  userId!: number;
  isUpdating: boolean = false;
  intervalId: any;

  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef // ✅ added
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.userId = user.userId;

    this.loadOrderStatus();

    // ✅ Auto refresh every 5 seconds (real-time feel)
    this.intervalId = setInterval(() => {
      this.loadOrderStatus();
    }, 5000);
  }

  loadOrderStatus() {
    this.orderService.getLatestOrder(this.userId).subscribe(
      (response: any) => {
        console.log('API Response:', response);

        this.order = response;

        // ✅ FORCE UI UPDATE
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading order status', error);
      }
    );
  }

  updateDeliveryStatus(newStatus: string) {
    this.isUpdating = true;

    this.orderService.updateOrderStatus(this.order.orderId, newStatus).subscribe(
      () => {
        this.loadOrderStatus();
        this.isUpdating = false;

        // ✅ Ensure UI refresh after update
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error updating delivery status', error);
        this.isUpdating = false;
      }
    );
  }

  getStatusText(statusId: number): string {
    return statusId == 1 ? "Cancelled" :
           statusId == 2 ? "Pending" :
           statusId == 3 ? "Confirmed" :
           statusId == 4 ? "Shipped" :
           statusId == 5 ? "Delivered" : "Unknown";
  }

  // ✅ Cleanup to avoid memory leak
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}