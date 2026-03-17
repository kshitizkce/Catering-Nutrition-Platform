import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['../signup/signup.css']
})
export class ResetPasswordComponent {

  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;  // to handle button state

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone  // ✅ inject NgZone
  ) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  changePassword() {

    if (!this.newPassword || !this.confirmPassword) {
      alert("All fields required");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (this.loading) return;

    this.loading = true;

    this.auth.resetPassword(this.token, this.newPassword)
      .pipe(finalize(() => {
        // always reset loading inside Angular zone
        this.ngZone.run(() => {
          this.loading = false;
        });
      }))
      .subscribe({
        next: (res: any) => {
          this.ngZone.run(() => {
            alert(res.message || "Password reset successful");
            // redirect after 1s
            setTimeout(() => this.router.navigate(['/']), 1000);
          });
        },
        error: (err: any) => {
          this.ngZone.run(() => {
            alert(err.error?.message || err.error || "Reset failed");
          });
        }
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}