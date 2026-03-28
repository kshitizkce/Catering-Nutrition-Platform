import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-profile.html',
  styleUrls: ['./vendor-profile.css']
})
export class VendorProfileComponent {

  activePage: string = 'dashboard';
  editMessage: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  setPage(page: string) {
    this.activePage = page;
    this.editMessage = '';
    this.cdr.detectChanges();
  }

  viewOrders() {
    this.activePage = 'orders';
    this.cdr.detectChanges();
  }

  editItem(item: string) {
    this.editMessage = `${item} selected for editing`;
    this.cdr.detectChanges();
  }

  updateSubscriber(name: string) {
    alert(`${name} subscription updated!`);
    this.cdr.detectChanges();
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

}