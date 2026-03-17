import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './vendor-layout.html',
  styleUrls: ['./vendor-layout.css']
})
export class VendorLayoutComponent {

  isOpen: boolean = false;

  constructor() {

    const savedStatus = localStorage.getItem('restaurantOpen');

    if (savedStatus !== null) {
      this.isOpen = savedStatus === 'fasle';
    }

  }

  toggleRestaurant() {

    localStorage.setItem('restaurantOpen', String(this.isOpen));

  }

}