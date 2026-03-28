import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDto, LoginDto } from '../services/auth/auth';
import { VendorService } from '../services/vendor/vendor-service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  isLogin = true;

  fullName = '';
  email = '';
  phone = '';
  password = '';

  emailOtp = '';
  phoneOtp = '';

  emailVerified = false;
  phoneVerified = false;

  showEmailVerify = false;
  showPhoneVerify = false;

  showEmailOtpInput = false;
  showPhoneOtpInput = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private vendorService: VendorService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  switchToLogin() {
    this.isLogin = true;
    this.clearSignupState();
    this.cdr.detectChanges();
  }

  switchToSignup() {
    this.isLogin = false;
    this.clearSignupState();
    this.cdr.detectChanges();
  }

  clearSignupState() {
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.password = '';

    this.emailOtp = '';
    this.phoneOtp = '';

    this.emailVerified = false;
    this.phoneVerified = false;

    this.showEmailVerify = false;
    this.showPhoneVerify = false;

    this.showEmailOtpInput = false;
    this.showPhoneOtpInput = false;

    this.cdr.detectChanges();
  }

  // LOGIN
  login() {
    if (!this.email || !this.password) {
      alert("Email and password required");
      return;
    }

    const dto: LoginDto = { email: this.email, password: this.password };

    this.authService.login(dto).pipe(

      tap((res: any) => {
        this.authService.setUser(res);
      })

    ).subscribe({

      next: (vendorRes: any) => {
        this.ngZone.run(() => {

          const user = this.authService.getUser();

          alert("Login successful");

          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userRoles", JSON.stringify(user.roles || [user.role]));

          if ((user.roles || []).length === 1) {
            const role = user.roles[0] || user.role;

            if (role === "Admin") this.router.navigate(['/admin-profile']);
            else if (role === "Vendor") this.router.navigate(['/vendor-dashboard']);
            else this.router.navigate(['/home']);

          } else {
            this.router.navigate(['/role-select']);
          }

          this.cdr.detectChanges();
        });
      },

      error: async (err: any) => {
        this.ngZone.run(async () => {

          let msg = "Login failed";

          if (err.error) {
            if (typeof err.error === 'string') msg = err.error;
            else if (err.error.message) msg = err.error.message;
            else if (err.error instanceof Blob) {
              const text = await err.error.text();
              try {
                const json = JSON.parse(text);
                msg = json.message || text;
              } catch {
                msg = text;
              }
            }
          }

          alert(msg);
          this.cdr.detectChanges();
        });
      }

    });
  }

  // SIGNUP
  signup(roleType: 'customer' | 'vendor') {

    if (!this.fullName || !this.email || !this.password || !this.phone) {
      alert("All fields required");
      return;
    }

    if (!this.emailVerified) {
      alert("Please verify email first");
      return;
    }

    if (!this.phoneVerified) {
      alert("Please verify phone first");
      return;
    }

    const dto: RegisterDto = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      roleId: roleType === 'customer' ? 1 : 2,
      subscriptionTypeId: 1
    };

    this.authService.register(dto, roleType).subscribe({

      next: (res: any) => {
        this.ngZone.run(() => {

          alert(res.message || "Registration successful. Please login.");

          this.fullName = '';
          this.email = '';
          this.phone = '';
          this.password = '';

          this.isLogin = false;

          setTimeout(() => {
            this.isLogin = true;
            this.cdr.detectChanges();
          }, 0);

          this.cdr.detectChanges();
        });
      },

      error: (err: any) => {
        this.ngZone.run(() => {

          const msg =
            err?.error?.message ||
            err?.error ||
            err?.message ||
            "Registration failed";

          alert(msg);
          this.cdr.detectChanges();
        });
      }

    });
  }

  onEmailChange() {
    this.showEmailVerify = this.email.length > 3;
    this.emailVerified = false;
    this.showEmailOtpInput = false;
    this.emailOtp = '';
    this.cdr.detectChanges();
  }

  sendEmailOtp() {

    if (!this.email) {
      alert("Enter email first");
      return;
    }

    this.authService.sendEmailOtp(this.email).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.showEmailOtpInput = true;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err?.error?.message || "Failed to send OTP");
        this.cdr.detectChanges();
      }
    });
  }

  verifyEmailOtp() {

    this.authService.verifyEmailOtp(this.email, this.emailOtp).subscribe({

      next: (res: any) => {
        alert(res.message);
        this.emailVerified = true;
        this.showEmailOtpInput = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        alert(err?.error?.message || "Invalid OTP");
        this.cdr.detectChanges();
      }

    });

  }

  sendPhoneOtp() {

    if (!this.phone) {
      alert("Enter phone first");
      return;
    }

    this.authService.sendPhoneOtp(this.phone).subscribe({

      next: (res: any) => {
        alert(res.message);
        this.showPhoneOtpInput = true;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        alert(err?.error?.message || "OTP send failed");
        this.cdr.detectChanges();
      }

    });

  }

  verifyPhoneOtp() {

    this.authService.verifyPhoneOtp(this.phone, this.phoneOtp).subscribe({

      next: (res: any) => {
        alert(res.message);
        this.phoneVerified = true;
        this.showPhoneOtpInput = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        alert(err?.error?.message || "Invalid OTP");
        this.cdr.detectChanges();
      }

    });

  }

  onPhoneChange() {
    this.showPhoneVerify = this.phone.length > 5;
    this.phoneVerified = false;
    this.showPhoneOtpInput = false;
    this.phoneOtp = '';
    this.cdr.detectChanges();
  }

  signupAsCustomer() {
    this.signup('customer');
  }

  signupAsVendor() {
    this.signup('vendor');
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}