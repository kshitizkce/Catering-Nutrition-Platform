import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../services/auth/auth';
import { AdminCustomerService } from '../services/admindashboard/admin-customer';
import { CustomerProfileService } from '../services/customerprofile/customer-profile.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.css']
})
export class CustomerProfileComponent implements OnInit {

  userEmail = '';
  userName = '';
  phone = '';
  userId!: number;
  registeredDate: string = '';
  activeSection = 'orders';

  subscription: any;
  subscriptionName = '';
  daysLeft = 0;

  orders: any[] = [];
  latestOrder: any;

  totalOrders = 0;
  totalSpent = 0;

  addresses: any[] = [];
  payments: any[] = [];

  // ADDRESS FORM
  street = '';
  city = '';
  province = '';
  postalCode = '';
  country = '';

  // PAYMENT FORM
  cardHolderName = '';
  cardBrand = '';
  cardLast4 = '';
  expiryMonth!: number;
  expiryYear!: number;
  paymentToken = '';

  // Track IDs
  selectedAddressId: number | null = null;
  selectedPaymentId: number | null = null;

  savedAddressId: number | null = null;

  constructor(
    private userService: AuthService,
    private custService: CustomerProfileService,
    private adminService: AdminCustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadSubscription();
    this.loadOrders();
    this.loadAddresses();
    this.loadPayments();
  }

  initializeUser() {
    const user = this.userService.getUser();
    if (!user) return;

    this.userId = user.userId;
    this.userEmail = user.email;
    this.userName = user.fullName;
  }

  goToTracking() {
  this.router.navigate(['/deliverytracking']);
}

  openSection(section: string) {
    this.activeSection = section;

    if (section === 'address') {
      this.loadAddresses();
    }

    if (section === 'payment') {
      this.loadPayments();
    }

    setTimeout(() => {
      const element = document.getElementById(section + 'Section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  loadAddresses() {
    this.custService.getAddresses(this.userId).subscribe(res => {
      this.addresses = res || [];

      if (this.addresses.length > 0) {
        const addr = this.addresses[0];
        this.selectedAddressId = addr.id;

        this.street = addr.street;
        this.city = addr.city;
        this.province = addr.province;
        this.postalCode = addr.postalCode;
        this.country = addr.country;

        this.savedAddressId = addr.id; // ✅ reuse existing
      }

      this.cdr.detectChanges();
    });
  }

  loadPayments() {
    this.custService.getPayments(this.userId).subscribe(res => {
      this.payments = res || [];

      if (this.payments.length > 0) {
        const pay = this.payments[0];
        this.selectedPaymentId = pay.id;

        this.cardHolderName = pay.cardHolderName;
        this.cardBrand = pay.cardBrand;
        this.cardLast4 = pay.cardLast4;
        this.expiryMonth = pay.expiryMonth;
        this.expiryYear = pay.expiryYear;
        this.paymentToken = pay.paymentMethodToken;
      }

      this.cdr.detectChanges();
    });
  }

  loadSubscription() {
    this.custService.getSubscriber(this.userId).subscribe(res => {
      this.subscription = res;

      const created = new Date(res.createdAt);
      const duration = res.subscriptionTypeId === 1 ? 7 : 30;

      const end = new Date(created);
      end.setDate(end.getDate() + duration);

      this.daysLeft = Math.max(
        Math.ceil((end.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        0
      );

      this.subscriptionName =
        res.subscriptionTypeId === 1 ? 'Weekly' : 'Monthly';

      this.cdr.detectChanges();
    });
  }

  loadOrders() {
    this.adminService.getCustomerDetails(this.userId).subscribe(res => {

      const user = res.user;

      this.userName = user.fullName;
      this.userEmail = user.email;
      this.phone = user.phone || '';
      this.registeredDate = user.createdAt;

      this.orders = res.orders.data || [];
      this.totalOrders = res.totalOrders;
      this.totalSpent = res.totalRevenue;

      const sortedOrders = [...this.orders].sort((a, b) => {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      });

      this.latestOrder = sortedOrders.length > 0 ? sortedOrders[0] : null;

      this.cdr.detectChanges();
    });
  }

  getStatusText(order: any): string {
    const status = order?.orderStatus || order?.status;

    switch (status) {
      case 'Cancelled': return 'Cancelled';
      case 'Pending': return 'Waiting for confirmation';
      case 'Confirmed': return 'Preparing meal';
      case 'Shipped': return 'Out for delivery';
      case 'Delivered': return 'Delivered';
      default: return 'Unknown';
    }
  }

  // ✅ FIXED FLOW
  editProfile() {

    const userData = {
      fullName: this.userName,
      email: this.userEmail,
      phone: this.phone
    };

    this.custService.updateProfile(this.userId, userData).subscribe({
      next: () => {

        // 1️⃣ Save/Update Address
        const addressData = {
          street: this.street,
          city: this.city,
          province: this.province,
          postalCode: this.postalCode,
          country: this.country
        };

        this.custService.addAddress(this.userId, addressData).subscribe((res: any) => {

          // ✅ get addressId
          this.savedAddressId = res.addressId;

          // 2️⃣ Now Save Payment WITH BillingAddressId
          const paymentData = {
            cardHolderName: this.cardHolderName,
            cardBrand: this.cardBrand,
            cardLast4: this.cardLast4,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            paymentMethodToken: this.paymentToken,
            billingAddressId: this.savedAddressId   // ✅ IMPORTANT
          };

          this.custService.addPayment(this.userId, paymentData)
            .subscribe(() => {
              this.loadPayments();
            });

          this.loadAddresses();
        });

        alert('Profile updated successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update profile failed:', err);
        alert('Profile update failed');
      }
    });
  }

  logout() {
    localStorage.clear();
  }

  deleteAddress() {
    this.custService.deleteAddress(this.userId).subscribe({
      next: () => {
        this.loadAddresses();
      },
      error: (err) => console.error(err)
    });
  }

  deletePayment() {
    this.custService.deletePayment(this.userId).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (err) => console.error(err)
    });
  }
}