import { Component, NgZone } from '@angular/core';
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
    private ngZone: NgZone   // ✅ Inject NgZone
  ) {}

  sendResetLink() {
  if (!this.email) {
    alert("Email required"); // show alert if email empty
    return;
  }

  if (this.loading) return;

  this.loading = true;

  this.auth.forgotPassword(this.email)
    .pipe(finalize(() => {
      // always reset loading inside Angular zone
      this.ngZone.run(() => {
        this.loading = false;
      });
    }))
    .subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          alert(res.message || "Reset link sent successfully"); // show success as alert
        });
      },
      error: (err: any) => {
        this.ngZone.run(() => {
          alert(err.error?.message || err.error || "Something went wrong"); // show error as alert
        });
      }
    });
}

  goBack() {
    this.router.navigate(['/']);
  }

}