import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminCustomerService, Customer } from '../services/admindashboard/admin-customer';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-customers.html',
  styleUrls: ['./admin-customers.css']
})
export class AdminCustomersComponent implements OnInit {

  searchText: string = '';
  selectedFilter: string = 'All';
  customers: Customer[] = [];

  constructor(
    private router: Router,
    private customerService: AdminCustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        // 🔹 Use a new array to trigger change detection
        this.customers = [...data];
        this.cdr.detectChanges();
        console.log('Loaded customers:', this.customers);
      },
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  // 🔹 Filter + search
  get filteredCustomers() {
    return this.customers.filter(c => {
      const status = c.status?.toLowerCase() || 'inactive';
      const filter = this.selectedFilter.toLowerCase();

      return (filter === 'all' || status === filter) &&
             (c.fullName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              c.email?.toLowerCase().includes(this.searchText.toLowerCase()));
    });
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  openCustomer(customer: Customer) {
    this.router.navigate(['/admin-customer-details', customer.userId], {
      state: { customer }
    });
  }

  // Optional trackBy for better rendering performance
  trackByUserId(index: number, customer: Customer) {
    return customer.userId;
  }
}