import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector:'app-forgot-password',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./forgot-password.html',
  styleUrls:['../signup/signup.css']
})
export class ForgotPasswordComponent {

  email = '';
  message = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  sendResetLink() {
    if (!this.email) {
      alert("Email required");
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.cdr.detectChanges();

    this.auth.forgotPassword(this.email)
      .pipe(finalize(() => {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }))
      .subscribe({
        next: (res: any) => {
          this.ngZone.run(() => {
            alert(res.message || "Reset link sent successfully");
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          this.ngZone.run(() => {
            alert(err.error?.message || err.error || "Something went wrong");
            this.cdr.detectChanges();
          });
        }
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }

}