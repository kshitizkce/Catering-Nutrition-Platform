import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';
import { MenuService } from '../../services/menu/menu';
import { VendorService } from '../../services/vendor/vendor-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule], // ensure the module is imported correctly
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  // ✅ Receive email from parent
  @Input() userEmail: string = '';

  constructor(
    private router: Router,
    private menuService: MenuService,
    private userService: AuthService,
    private vendorService: VendorService
  ) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToAccount() {
    this.router.navigate(['/profile']);
  }

  goToSubscriptionCart() {
    const user = this.userService.getUser();
    const userId = user.userId;

    this.vendorService.getSubscriber(userId).subscribe({
      next: (res: any) => {
        if (res && res.userId) {
          // ✅ Has subscription → go to subscription cart
          this.router.navigate(['/subscriptioncart']);
        } else {
          alert("❌ No active meal subscription found");
        }
      },
      error: () => {
        alert("❌ You don't have a meal subscription");
      }
    });
  }
}