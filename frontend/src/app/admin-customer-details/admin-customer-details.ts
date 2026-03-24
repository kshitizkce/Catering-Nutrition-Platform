import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminCustomerService, CustomerDetailsResponse } from '../services/admindashboard/admin-customer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-customer-details',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-customer-details.html',
  styleUrls: ['./admin-customer-details.css']
})
export class AdminCustomerDetailsComponent implements OnInit {
  customer: CustomerDetailsResponse['user'] | null = null;
  orders: (CustomerDetailsResponse['orders']['data'][0] & { expanded?: boolean })[] = [];
  totalOrders: number = 0;
  totalSpent: number = 0;
  topOrderedItem: CustomerDetailsResponse['topOrderedItem'] | null = null;

  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(
    private router: Router,
    private service: AdminCustomerService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!userId) return;
    this.loadCustomer(userId);
  }

  loadCustomer(userId: number) {
    this.service.getCustomerDetails(userId, this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.customer = res.user;
        this.orders = res.orders.data.map(o => ({ ...o, expanded: false }));
        this.totalOrders = res.totalOrders;
        this.totalSpent = res.totalRevenue;
        this.topOrderedItem = res.topOrderedItem;

        // Calculate total pages
        this.totalPages = Math.ceil(this.totalOrders / this.pageSize);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to fetch customer details', err)
    });
  }

  goBack() {
    this.router.navigate(['/admin-customers']);
  }

  toggleOrderItems(order: any) {
    order.expanded = !order.expanded;
    this.cdr.detectChanges();
  }

  // Pagination Methods
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCustomer(this.customer?.userId!);
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadCustomer(this.customer?.userId!);
    }
  }
}