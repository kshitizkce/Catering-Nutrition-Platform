import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VendorService } from '../services/vendor/vendor-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu/menu';


@Component({
  selector: 'app-vendor-subscribers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-subscribers.html',
  styleUrls: ['./vendor-subscribers.css']
})
export class VendorSubscribersComponent implements OnInit {

  vendorId: number = 0;
  vendors: any[] = []; // ✅ vendor list

  subscribers: any[] = [];
  subscribersLoaded: boolean = false;
  editingSubscriber: any = null;
  isOpen: boolean = true; // admin can always edit

  constructor(
    private vendorService: VendorService,
    private menuService :MenuService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  // ✅ Load all vendors for dropdown
  loadVendors() {
     this.menuService.getVendors().subscribe({
    next: (res: any) => {
      this.vendors = res || [];

      // ✅ Set first vendor as default
      if (this.vendors.length > 0) {
        this.vendorId = this.vendors[0].vendorId;

        // 🔥 Automatically load subscribers for first vendor
        this.loadSubscribers();
      }

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Failed to fetch vendors", err);
    }
  });
}

  // ✅ When admin selects a vendor
  onVendorChange(event: any) {
    this.vendorId = Number(event.target.value);
    this.loadSubscribers();
  }

  // ✅ Load subscribers based on selected vendor
  loadSubscribers() {
    if (!this.vendorId) return;

    this.subscribersLoaded = false;
    this.cdr.detectChanges();

    this.vendorService.getSubscribers(this.vendorId).subscribe(
      (res: any) => {
        this.subscribers = (res || []).map((s: any) => ({
          subscriberId: s.subscriberId,
          name: s.user?.fullName || 'No Name',
          plan: s.subscriptionType?.subscriptionName || 'Free',
          status: s.status || 'Unknown'
        }));
        this.subscribersLoaded = true;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error(err);
        this.subscribers = [];
        this.subscribersLoaded = true;
        alert("Failed to fetch subscribers");
        this.cdr.detectChanges();
      }
    );
  }

  editSubscriber(sub: any) {
    this.editingSubscriber = { ...sub };
    this.cdr.detectChanges();
  }

  saveSubscriber() {
    if (!this.editingSubscriber) return;

    const planId = this.editingSubscriber.plan === 'Paid' ? 2 : 1;

    this.vendorService.updateSubscriber(
      this.vendorId,
      this.editingSubscriber.subscriberId,
      { subscriptionTypeId: planId }
    ).subscribe(
      (res: any) => {
        alert(res.message || 'Subscriber updated successfully');
        this.loadSubscribers();
        this.editingSubscriber = null;
        this.cdr.detectChanges();
      },
      (err) => {
        console.error(err);
        alert('Failed to update subscriber');
        this.cdr.detectChanges();
      }
    );
  }

  cancelEdit() {
    this.editingSubscriber = null;
    this.cdr.detectChanges();
  }
}