import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { VendorMealCateringService, CateringEvent } from '../services/vendor/catering-event';
import { VendorService, Customer } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MenuService } from '../services/menu/menu';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-vendor-meal-catering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-meal-catering.html',
  styleUrls: ['./admin-meal-catering.css']
})
export class AdminMealCatering implements OnInit, OnDestroy {

  events: (CateringEvent & { customer?: any })[] = [];
  vendors: any[] = [];

  selectedFile!: File;
  message = '';
  selectedEventId!: number;

  vendorId: number | null = null;
  selectedVendorId: number | null = null;

  selectedCustomer: Customer | null = null;
  showEmailSection = false;

  constructor(
    private service: VendorMealCateringService,
    private authService: AuthService,
    private  menuService:MenuService,
    private userService: VendorService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadVendors();

    const user = this.authService.getUser();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const userId = user.userId;

    this.userService.getVendorByUserId(userId).subscribe({
      next: (vendor: any) => {
        this.vendorId = vendor.vendorId;
        this.selectedVendorId = vendor.vendorId;

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

  // ✅ LOAD VENDORS
  loadVendors() {
    this.userService.getMealCateringVendors().subscribe({
      next: (res: any[]) => {
        this.vendors = res;

        if (res.length > 0) {
          this.selectedVendorId = res[0].vendorId;
          this.vendorId = this.selectedVendorId;
        }

        this.cdr.detectChanges(); // ✅ Detect changes after vendors load
      },
      error: err => console.error(err)
    });
  }

  // ✅ VENDOR CHANGE
  onVendorChange() {
    this.vendorId = this.selectedVendorId;
    this.loadEvents();
      this.cdr.detectChanges();

  }

  // ✅ LOAD EVENTS
  loadEvents() {
  if (!this.vendorId) return;

  this.events = []; // ✅ clear old data so UI refresh is visible

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

  // ✅ STATUS UPDATE
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

  // ✅ SEND EMAIL
  sendDetails() {
    const formData = new FormData();
    formData.append('message', this.message);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.service.sendDetails(this.selectedEventId, formData).subscribe({
      next: () => {
        alert('Email sent successfully');

        // reset UI only (no status change)
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