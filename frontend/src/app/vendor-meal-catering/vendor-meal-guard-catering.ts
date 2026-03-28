import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MealCateringGuard implements CanActivate {

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const user = this.authService.getUser();

    if (!user || !user.userId) {
      this.router.navigate(['/']);
      return of(false);
    }

    return this.vendorService.getVendorProfile(user.userId).pipe(
      map((data: any) => {

        // ✅ ALLOW
        if (data.mealCateringStatus === 1) {
          return true;
        }

        // ❌ BLOCK
        alert("Meal Catering is disabled for your account");
        this.router.navigate(['/vendor-dashboard']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/vendor-dashboard']);
        return of(false);
      })
    );
  }
}