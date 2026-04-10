import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar';



@Component({
  selector: 'app-cart',
  standalone: true, // ✅ make sure this exists
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [
    CommonModule,NavbarComponent,  // ✅ THIS FIXES ngIf & ngFor
    FormsModule
  ]
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  subtotal = 0;
  tax = 0;
  service = 0;
  total = 0;
  userId!: number;
    userEmail = '';


  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
        this.initializeUser();

    const user = this.authService.getUser();
    this.userId = user.userId;
    this.loadCart();
  }

   initializeUser() {
    const user = this.authService.getUser();
    if (!user) return;

    this.userId = user.userId;
    this.userEmail = user.email;
  }

  loadCart() {
  this.cartService.getCart(this.userId).subscribe(res => {
    this.cartItems = res;

    console.log("Cart Items:", this.cartItems); // ✅ DEBUG

    this.calculateTotal();
    this.cdr.detectChanges();
  });
}

  calculateTotal() {
    this.subtotal = this.cartItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity, 0
    );

    this.tax = this.subtotal * 0.13;
    this.service = this.subtotal * 0.05;
    this.total = this.subtotal + this.tax + this.service;
  }

  proceedToCheckout() {
      sessionStorage.removeItem("subscriptionData");

    this.router.navigate(['/checkout']);
  }

  increaseQty(item: any) {
  item.quantity++;

  this.cartService.updateQuantity(item.cartItemId, item.quantity)
    .subscribe(() => {
      this.calculateTotal();
      this.cdr.detectChanges();
    });
}

decreaseQty(item: any) {
  if (item.quantity <= 1) return;

  item.quantity--;

  this.cartService.updateQuantity(item.cartItemId, item.quantity)
    .subscribe(() => {
      this.calculateTotal();
      this.cdr.detectChanges();
    });
}

removeItem(item: any) {
  this.cartService.removeItem(item.cartItemId)
    .subscribe(() => {
      this.cartItems = this.cartItems.filter(i => i.cartItemId !== item.cartItemId);
      this.calculateTotal();
      this.cdr.detectChanges();
    });
}
}