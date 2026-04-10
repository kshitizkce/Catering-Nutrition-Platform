import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccessComponent implements OnInit {

  orderId: number | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    // ✅ Get navigation state
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras?.state?.['orderId']) {
      this.orderId = nav.extras.state['orderId'];
    }

    // ✅ Fallback (VERY IMPORTANT after refresh)
    if (!this.orderId) {
      const stored = history.state?.orderId;
      if (stored) {
        this.orderId = stored;
      }
    }

    // 🔥 FORCE UI UPDATE
    this.cdr.detectChanges();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}