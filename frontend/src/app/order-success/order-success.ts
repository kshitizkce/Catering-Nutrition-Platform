import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../services/auth/auth';



@Component({
  selector: 'app-order-success',
  standalone: true,
    imports: [ NavbarComponent],
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccessComponent implements OnInit {

  orderId: number | null = null;
    userEmail = '';


  constructor(
    private router: Router,
        private userService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeUser();

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

  initializeUser() {
    const user = this.userService.getUser();
    if (!user) return;

    
    this.userEmail = user.email;
  }


  goHome() {
    this.router.navigate(['/home']);
  }
}