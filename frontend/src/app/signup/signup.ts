import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDto, LoginDto } from '../services/auth/auth';

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
    private ngZone: NgZone
  ) {}

  
  switchToLogin() {
  this.isLogin = true;
  this.clearSignupState();
}

switchToSignup() {
  this.isLogin = false;
  this.clearSignupState();
}

// Reset OTP & input state
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
}

  // LOGIN
 login() {
  if (!this.email || !this.password) {
    alert("Email and password required");
    return;
  }

  const dto: LoginDto = { email: this.email, password: this.password };

  this.authService.login(dto).subscribe({
    next: (res: any) => {
      this.ngZone.run(() => {

        alert(res.message || "Login successful");

        // Store user info
        localStorage.setItem("token", res.token);
        localStorage.setItem("userEmail", res.email);
        localStorage.setItem("userName", res.fullName);

        // Roles array returned from backend
        localStorage.setItem("userRoles", JSON.stringify(res.roles || [res.role]));

        // If only one role, redirect directly
        if ((res.roles || []).length === 1) {
          const role = res.roles[0] || res.role;
          if (role === "Admin") this.router.navigate(['/admin-profile']);
          else if (role === "Vendor") this.router.navigate(['/vendor-dashboard']);
          else this.router.navigate(['/home']);
        } else {
          // multiple roles → show role selection
          this.router.navigate(['/role-select']);
        }

      });
    },
    error: async (err: any) => {
  this.ngZone.run(async () => {

    let msg = "Login failed";

    if (err.error) {
      // ✅ Case 1: string
      if (typeof err.error === 'string') {
        msg = err.error;
      }

      // ✅ Case 2: object with message
      else if (err.error.message) {
        msg = err.error.message;
      }

      // ✅ Case 3: Blob (🔥 your likely issue)
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

    
    // clear form
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.password = '';

    // force UI refresh event
    this.isLogin = false;

    setTimeout(() => {
      this.isLogin = true;
    }, 0);

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

        });
      }

    });
  }

  onEmailChange() {
  this.showEmailVerify = this.email.length > 3;

  // Reset verification if user deletes or changes email
  this.emailVerified = false;
  this.showEmailOtpInput = false;
  this.emailOtp = '';
}

sendEmailOtp() {

  if (!this.email) {
    alert("Enter email first");
    return;
  }

  this.authService.sendEmailOtp(this.email).subscribe({
    next: (res:any) => {
      alert(res.message);
      this.showEmailOtpInput = true;
    },
    error: (err:any) => {
      alert(err?.error?.message || "Failed to send OTP");
    }
  });

}

verifyEmailOtp() {

  this.authService.verifyEmailOtp(this.email, this.emailOtp).subscribe({

    next:(res:any)=>{
      alert(res.message);
      this.emailVerified = true;
      this.showEmailOtpInput = false;
    },

    error:(err:any)=>{
      alert(err?.error?.message || "Invalid OTP");
    }

  });

}
sendPhoneOtp() {

  if (!this.phone) {
    alert("Enter phone first");
    return;
  }

  this.authService.sendPhoneOtp(this.phone).subscribe({

    next:(res:any)=>{
      alert(res.message);
      this.showPhoneOtpInput = true;
    },

    error:(err:any)=>{
      alert(err?.error?.message || "OTP send failed");
    }

  });

}

verifyPhoneOtp() {

  this.authService.verifyPhoneOtp(this.phone, this.phoneOtp).subscribe({

    next:(res:any)=>{
      alert(res.message);
      this.phoneVerified = true;
      this.showPhoneOtpInput = false;
    },

    error:(err:any)=>{
      alert(err?.error?.message || "Invalid OTP");
    }

  });

}
onPhoneChange() {
  this.showPhoneVerify = this.phone.length > 5;

  // Reset verification if user deletes or changes phone
  this.phoneVerified = false;
  this.showPhoneOtpInput = false;
  this.phoneOtp = '';
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