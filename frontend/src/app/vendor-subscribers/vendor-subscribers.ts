import { Component, OnInit } from '@angular/core';
import { VendorService } from '../services/vendor/vendor-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth';


@Component({
  selector: 'app-vendor-subscribers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-subscribers.html',
  styleUrls: ['./vendor-subscribers.css']
})
export class VendorSubscribersComponent implements OnInit {

  vendorId: number = 0;
  subscribers: any[] = [];
  subscribersLoaded: boolean = false;
  editingSubscriber: any = null;
  isOpen: boolean = false;

  constructor(private vendorService: VendorService
    ,private authService: AuthService
  ) {}

  ngOnInit(): void {
  const user = this.authService.getUser();

  if (!user) {
    console.error("User not logged in");
    return;
  }

  const userId = user.userId;

  if (!userId) {
    console.error("User ID not found");
    return;
  }

  // ✅ Step 1: get vendorId from backend
  this.vendorService.getVendorByUserId(userId).subscribe({
    next: (vendor: any) => {
      this.vendorId = vendor.vendorId;

      if (!this.vendorId) {
        console.error("Vendor ID not found");
        return;
      }

      // Get store status from localStorage
    const savedStatus = localStorage.getItem('restaurantOpen');
    this.isOpen = savedStatus === 'true';

    this.loadSubscribers();
    },
    error: (err) => {
      console.error("Failed to fetch vendor:", err);
    }
  });
}

  loadSubscribers() {
    this.subscribersLoaded = false;
    this.vendorService.getSubscribers(this.vendorId).subscribe(
      (res: any) => {
        this.subscribers = (res || []).map((s: any) => ({
          subscriberId: s.subscriberId,
          name: s.user?.fullName || 'No Name',
          plan: s.subscriptionType?.subscriptionName || 'Free',
          status: s.status || 'Unknown'
        }));
        this.subscribersLoaded = true;
      },
      (err) => {
        console.error(err);
        this.subscribers = [];
        this.subscribersLoaded = true;
        alert("Failed to fetch subscribers");
      }
    );
  }

  editSubscriber(sub: any) {
    this.editingSubscriber = { ...sub };
  }

  saveSubscriber() {
    if (!this.editingSubscriber) return;

    const planId = this.editingSubscriber.plan === 'Paid' ? 2 : 1;

    this.vendorService.updateSubscriber(this.vendorId, this.editingSubscriber.subscriberId, { subscriptionTypeId: planId })
      .subscribe(
        (res: any) => {
          alert(res.message || 'Subscriber updated successfully');
          this.loadSubscribers();
          this.editingSubscriber = null;
        },
        (err) => {
          console.error(err);
          alert('Failed to update subscriber');
        }
      );
  }

  cancelEdit() {
    this.editingSubscriber = null;
  }
}