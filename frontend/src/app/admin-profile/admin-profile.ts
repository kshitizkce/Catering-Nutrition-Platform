import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu/menu';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {

  activePage: string = 'home';

  cateringRequests: any[] = [];

  vendors: any[] = [];

  selectedCustomer: any = null;
  selectedVendor: any = null;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    const stored = localStorage.getItem("cateringRequests");

    if (stored) {
      this.cateringRequests = JSON.parse(stored);
    }

    this.loadVendors();
  }

  loadVendors() {
    this.menuService.getVendors().subscribe({
      next: (res: any) => {
        this.vendors = res;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  setPage(page: string) {
    this.activePage = page;
  }

  approveRequest(index: number) {
    this.cateringRequests[index].status = "Approved";
    localStorage.setItem("cateringRequests", JSON.stringify(this.cateringRequests));
  }

  rejectRequest(index: number) {
    this.cateringRequests[index].status = "Rejected";
    localStorage.setItem("cateringRequests", JSON.stringify(this.cateringRequests));
  }

  deleteRequest(index: number) {
    this.cateringRequests.splice(index, 1);
    localStorage.setItem("cateringRequests", JSON.stringify(this.cateringRequests));
  }

  requestInfo() {
    alert("Vendor information request sent.");
  }

  saveSettings() {
    alert("Settings saved successfully.");
  }

  logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  openCustomer(customer: any) {
    this.selectedCustomer = customer;
  }

  closeCustomer() {
    this.selectedCustomer = null;
  }

  openVendor(vendor: any) {
    this.selectedVendor = vendor;
  }

  closeVendor() {
    this.selectedVendor = null;
  }
}