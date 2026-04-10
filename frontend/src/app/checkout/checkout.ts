import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { CheckoutService } from '../services/checkout/checkout-service';
import { PaymentService } from '../services/payment/payment-service';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { switchMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  imports: [CommonModule, FormsModule]
})
export class CheckoutComponent implements OnInit {

  isSubscription = false;
subscriptionData: any;

  cartItems: any[] = [];

  addresses: any[] = [];
  payments: any[] = [];

  selectedAddressId!: number;
  selectedPaymentId!: number;

  tip: number = 0;
  userId!: number;

  subtotal = 0;
  tax = 0;
  service = 0;
  total = 0;

  loading = false;

  stripe: any;
card: any;

subscriptionAmount = 0;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private paymentService: PaymentService,
        private vendorService: VendorService,

     private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit() {
  this.stripe = await loadStripe('pk_test_51SwqzmBds6XyKKtn6BZYgn7599fiJ4I4sMGDNJGi6U5Ab01c1BqjlOUa1z7yL4mtS8R1W12MZ1vxvsboLzRJwJ2B00t1aghTjG'); // 🔑 replace

  const elements = this.stripe.elements();

  this.card = elements.create('card');

  this.card.mount('#card-element');
}

ngOnInit() {

  const user = this.authService.getUser();
  this.userId = user.userId;

  const saved = sessionStorage.getItem("subscriptionData");

  // ==============================
  // 🔥 SUBSCRIPTION MODE
  // ==============================
  if (saved) {
    this.isSubscription = true;
    this.subscriptionData = JSON.parse(saved);
    this.subscriptionAmount = this.subscriptionData.amount;

    this.subtotal = this.subscriptionAmount;

  } else {
    this.isSubscription = false;
    this.loadCart();
  }

  // ✅ ALWAYS calculate after setting subtotal
  this.calculateTotal();

  this.loadAddresses();
  this.loadPayments();
}
loadCart() {
  this.cartService.getCart(this.userId).subscribe(items => {

    this.cartItems = items;

    this.subtotal = items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity, 0
    );

    // ❌ REMOVE THESE
    // this.tax = ...
    // this.service = ...

    this.calculateTotal(); // ✅ ONLY THIS

    this.cdr.detectChanges();
  });
}
  loadAddresses() {
    this.checkoutService.getAddresses(this.userId)
      .subscribe(res => {
        this.addresses = res;
        this.cdr.detectChanges();
      });
  }

  loadPayments() {
    this.checkoutService.getPayments(this.userId)
      .subscribe(res => {
        this.payments = res;
        this.cdr.detectChanges();
      });
  }

  calculateTotal() {
    // 🔥 handle subscription separately
  if (this.isSubscription) {
    this.subtotal = this.subscriptionAmount;
  }

  // ✅ Canada calculations
  this.tax = +(this.subtotal * 0.13).toFixed(2);
  this.service = +(this.subtotal * 0.05).toFixed(2);

  this.total = +(this.subtotal + this.tax + this.service + this.tip).toFixed(2);
  }

  onTipChange() {
    this.calculateTotal();
  }

  async checkout() {

  if (!this.selectedAddressId) {
    alert("Please select address");
    return;
  }

  // ==============================
  // 🔥 SUBSCRIPTION FLOW (CLEAN)
  // ==============================
  if (this.isSubscription) {

    this.paymentService.createPaymentIntent(this.subscriptionAmount)
      .subscribe(async (res: any) => {

        const clientSecret = res.clientSecret;

        const result = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: this.card }
        });

        if (result.error) {
          alert(result.error.message);
          return;
        }

        const payload = {
  userId: this.userId,
  subscriptionTypeId: this.subscriptionData.plan === 'weekly' ? 1 : 2,
  mealsPerCycle: this.subscriptionData.meals,
  deliveryTime: this.subscriptionData.deliveryTime + ":00",

  startDate: new Date(),
  status: "Active",
  createdAt: new Date()
};

        this.vendorService.createSubscription(payload)
          .subscribe(() => {

            alert("🎉 Subscription Activated!");
                sessionStorage.removeItem("subscriptionData");


            this.router.navigate(['/vendors']);

          }, err => {
            console.error(err);
            alert("Failed to save subscription");
          });

      }, err => {
        console.error(err);
        alert("Payment failed");
      });

    return; // ✅ IMPORTANT
  }

  // ==============================
  // 🛒 NORMAL ORDER FLOW
  // ==============================
  this.cartService.checkout({
    userId: this.userId,
    billingAddressId: this.selectedAddressId,
    shippingAddressId: this.selectedAddressId,
    paymentId: this.selectedPaymentId,
    tip: this.tip
  }).pipe(

    switchMap((order: any) => {
      return this.paymentService.createPaymentIntent(order.totalAmount)
        .pipe(map((res: any) => ({
          order,
          clientSecret: res.clientSecret
        })));
    }),

    switchMap(async ({ order, clientSecret }) => {

      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: this.card }
      });

      if (result.error) throw new Error(result.error.message);

      return {
        order,
        paymentIntentId: result.paymentIntent.id
      };
    }),

    switchMap(({ order, paymentIntentId }) => {
      return this.paymentService.confirmPayment(order.orderId, paymentIntentId)
        .pipe(map(() => order));
    })

  ).subscribe({

    next: (order) => {
      this.router.navigate(['/order-success'], {
        state: { orderId: order.orderId }
      });
    },

    error: (err) => {
      alert(err.message || "Checkout failed");
    }

  });
}


}