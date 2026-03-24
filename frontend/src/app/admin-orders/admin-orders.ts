// admin-orders.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminCustomerService, Order } from '../services/admindashboard/admin-customer';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];
  selectedFilter = 'All';
  loading = true;

  constructor(
    private service: AdminCustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.service.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.map(o => ({ ...o, expanded: false }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get filteredOrders() {
    if (this.selectedFilter === 'All') return this.orders;
    return this.orders.filter(o => o.orderStatus === this.selectedFilter);
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  toggleOrder(order: Order) {
    order.expanded = !order.expanded;
    this.cdr.detectChanges();
  }
}