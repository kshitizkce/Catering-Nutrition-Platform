import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu/menu';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-home.html',
  styleUrls: ['./customer-home.css']
})
export class CustomerHomeComponent implements OnInit {

  vendors: any[] = [];
  filteredVendors: any[] = [];
  searchText: string = '';

  constructor(
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {

    /* Load vendors from backend API */

    this.menuService.getVendors().subscribe({

      next: (data: any) => {

        console.log("Vendors loaded:", data);

        this.vendors = data;
        this.filteredVendors = data;

      },

      error: (err) => {

        console.error("Vendor API error:", err);

      }

    });

  }

  /* SEARCH FUNCTION */

  search(): void {

    const text = this.searchText.trim().toLowerCase();

    if (text === '') {
      this.filteredVendors = this.vendors;
      return;
    }

    this.filteredVendors = this.vendors.filter(vendor =>
      vendor?.name?.toLowerCase().includes(text)
    );

  }

  /* LIVE SEARCH */

  onSearchChange(): void {
    this.search();
  }

  /* NAVIGATION */

  bookCatering(): void {
    this.router.navigate(['/book-catering']);
  }

  goToSubscription(): void {
    this.router.navigate(['/subscription']);
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToAccount(): void {
    this.router.navigate(['/profile']);
  }

  viewVendor(vendor: any): void {

    if (!vendor?.vendorId) return;

    this.router.navigate(['/vendor', vendor.vendorId]);

  }

  viewAllVendors(): void {
    this.router.navigate(['/vendors']);
  }

}