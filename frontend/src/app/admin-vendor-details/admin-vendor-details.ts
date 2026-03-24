import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminVendorService, VendorDetailsResponse, Order } from '../services/admindashboard/admin-vendor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-vendor-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-vendor-details.html',
  styleUrls: ['./admin-vendor-details.css']
})
export class AdminVendorDetailsComponent implements OnInit {

  vendor: VendorDetailsResponse['vendor'] | null = null;
  orders: Order[] = [];
  totalOrders = 0;
  totalEarned = 0;
  topSellingItem?: { menuItemId: number; itemName: string; totalQuantitySold: number };

  pageNumber = 1;
  pageSize = 10;
  totalOrderCount = 0;

  // ✅ NEW
  expandedOrderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: AdminVendorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const vendorId = params.get('id');
      if (vendorId) {
        this.loadVendorDetails(+vendorId);
      }
    });
  }

  loadVendorDetails(vendorId: number) {
    this.vendorService.getVendorDetails(vendorId, this.pageNumber, this.pageSize)
      .subscribe(res => {
        this.vendor = res.vendor;
        this.orders = res.orders.data;
        this.totalOrders = res.totalOrders;
        this.totalEarned = res.totalRevenue;
        this.totalOrderCount = res.orders.totalCount;
        this.topSellingItem = res.topSellingItem;

        this.cdr.detectChanges();
      }, err => {
        console.error('Failed to load vendor details', err);
      });
  }

  // ✅ NEW
  toggleOrder(orderId: number) {
    this.expandedOrderId =
      this.expandedOrderId === orderId ? null : orderId;
  }

  goBack() {
    this.router.navigate(['/admin-vendors']);
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalOrderCount) {
      this.pageNumber++;
      if (this.vendor) this.loadVendorDetails(this.vendor.vendorId);
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      if (this.vendor) this.loadVendorDetails(this.vendor.vendorId);
    }
  }
}