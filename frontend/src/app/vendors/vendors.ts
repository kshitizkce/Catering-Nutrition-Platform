import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu/menu';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports:[CommonModule],
  templateUrl:'./vendors.html',
  styleUrls:['./vendors.css']
})
export class VendorsComponent implements OnInit {

  vendors:any[] = [];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.menuService.getVendors().subscribe({

      next: (data) => {

        console.log("Vendors from API:", data);

        this.vendors = data;
        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error("Vendor API error", err);
        this.cdr.detectChanges();

      }

    });
  }

  openVendor(vendor:any) {
    this.router.navigate(['/vendor', vendor.vendorId]);
  }

}