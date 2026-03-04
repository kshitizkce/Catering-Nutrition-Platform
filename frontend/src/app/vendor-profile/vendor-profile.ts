import { Component } from '@angular/core';
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

  setPage(page: string) {
    this.activePage = page;
    this.editMessage = '';
  }

  viewOrders() {
    this.activePage = 'orders';
  }

  editItem(item: string) {
    this.editMessage = `${item} selected for editing`;
  }

  updateSubscriber(name: string) {
    alert(`${name} subscription updated!`);
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

}