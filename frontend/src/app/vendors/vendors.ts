import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../services/vendor/vendor-service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../services/auth/auth';


@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './vendors.html',
  styleUrls: ['./vendors.css']
})
export class VendorsComponent implements OnInit {

  vendors: any[] = [];
  userEmail: string = '';


  constructor(
    public router: Router,
    private vendorService: VendorService,
    private userService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVendors();
    this.initializeUser();
  }

  initializeUser() {
  const user = this.userService.getUser();

  if (user) {
    this.userEmail = user.email;
  }
}

  loadVendors() {
    this.vendorService.getVendors().subscribe({
      next: (res) => {
        this.vendors = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading vendors:', err);
      }
    });
  }

  viewVendor(v: any) {
  

  this.router.navigate(['/vendor-details', v.VendorId || v.vendorId]);
  }

 

  // ---------------- BUSINESS HOURS LOGIC ----------------

  private getParsedHours(v: any): any[] {
    try {
      return JSON.parse(v.businessHours || '[]');
    } catch {
      return [];
    }
  }

  private getTodayName(): string {
    return new Date().toLocaleString('en-US', { weekday: 'long' });
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:mm
  }

  getTodayHours(v: any): string {
    const hours = this.getParsedHours(v);
    const today = this.getTodayName();

    const todayData = hours.find(h => h.name === today);

    if (!todayData) return 'No hours available';

    return `${today}: ${todayData.open} - ${todayData.close}`;
  }

  isVendorOpen(v: any): boolean {
    const hours = this.getParsedHours(v);
    const today = this.getTodayName();
    const now = this.getCurrentTime();

    const todayData = hours.find(h => h.name === today);

    if (!todayData) return false;

    return now >= todayData.open && now <= todayData.close;
  }

  getNextOpenTime(v: any): string {
    const hours = this.getParsedHours(v);
    const today = this.getTodayName();
    const now = this.getCurrentTime();

    // Check today first
    const todayData = hours.find(h => h.name === today);

    if (todayData && now < todayData.open) {
      return `${todayData.open} today`;
    }

    // Find next available day
    const daysOrder = [
      'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
    ];

    const todayIndex = daysOrder.indexOf(today);

    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDayName = daysOrder[nextDayIndex];

      const nextDayData = hours.find(h => h.name === nextDayName);

      if (nextDayData) {
        return `${nextDayName} at ${nextDayData.open}`;
      }
    }

    return 'Not available';
  }

  
}