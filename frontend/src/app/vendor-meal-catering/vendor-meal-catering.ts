import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { VendorMealCateringService, CateringEvent } from '../services/vendor/catering-event';
import { VendorService, Customer } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-vendor-meal-catering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-meal-catering.html',
  styleUrls: ['./vendor-meal-catering.css']
})
export class VendorMealCatering implements OnInit, OnDestroy {

  events: (CateringEvent & { customer?: any })[] = [];
  selectedFile!: File;
  message = '';
  selectedEventId!: number;

vendorId: number | null = null;
  selectedCustomer: Customer | null = null;
  showEmailSection = false;

  constructor(
    private service: VendorMealCateringService,
    private  authService:AuthService,
    private userService: VendorService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

   ngOnInit() {
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

  this.userService.getVendorByUserId(userId).subscribe({
    next: (vendor: any) => {
      this.vendorId = vendor.vendorId;

      if (!this.vendorId) {
        console.error("Vendor ID not found");
        return;
      }

      // ✅ ONLY call after vendorId is set
      this.loadEvents();
    },
    error: (err) => {
      console.error("Failed to fetch vendor:", err);
    }
  });
}

getSafeUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

  ngOnDestroy() {}

  // ✅ LOAD EVENTS
  loadEvents() {
  if (!this.vendorId) {
    console.error("vendorId is null or undefined");
    return;
  }

  this.service.getEvents(this.vendorId).subscribe({
    next: res => {
      this.events = res;

      const userRequests = this.events.map(e =>
        this.userService.getUserDetails(e.userId)
      );

      forkJoin(userRequests).subscribe({
        next: (users) => {
          users.forEach((user, index) => {
            this.events[index].customer = user;
          });

          this.cdr.detectChanges();
        },
        error: err => console.error(err)
      });

    },
    error: err => console.error(err)
  });
}

  // ✅ STATUS UPDATE (REAL-TIME UI UPDATE)
  changeStatus(event: CateringEvent, status: string) {
  this.service.updateStatus(event.eventId, status).subscribe({
    next: () => {

      this.events = this.events.map(e => {
        if (e.eventId === event.eventId) {
          return {
            ...e,
            eventStatus: status
          };
        }
        return e;
      });

      alert('Status updated');
      this.cdr.detectChanges();
    },
    error: err => console.error(err)
  });
}

  // ✅ FILE SELECT
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ✅ OPEN EMAIL SECTION
  openSendDetails(eventId: number, userId: number) {
    this.selectedEventId = eventId;
    this.showEmailSection = true;

    this.userService.getUserDetails(userId).subscribe({
      next: (res) => {
        this.selectedCustomer = res;
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  // ✅ SEND EMAIL + UPDATE UI + CLOSE PANEL
  sendDetails() {
    const formData = new FormData();
    formData.append('message', this.message);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.service.sendDetails(this.selectedEventId, formData).subscribe({
      next: () => {
        alert('Email sent successfully');

        // ✅ Immediately update status locally (optional if backend confirms)
        const target = this.events.find(e => e.eventId === this.selectedEventId);
       

        // ✅ RESET UI
        this.message = '';
        this.selectedFile = undefined!;
        this.selectedEventId = undefined!;
        this.selectedCustomer = null;
        this.showEmailSection = false;

        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        alert('Failed to send');
      }
    });
  }
}