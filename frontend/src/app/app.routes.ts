import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Common components
import { SignupComponent } from './signup/signup';
import { RoleSelectComponent } from './role-select/role-select';
import { CustomerHomeComponent } from './customer-home/customer-home';
import { CustomerProfileComponent } from './customer-profile/customer-profile';
import { VendorProfileComponent } from './vendor-profile/vendor-profile';
import { AdminProfileComponent } from './admin-profile/admin-profile';
import { MenuComponent } from './menu/menu';
import { SubscriptionComponent } from './meal-subscription/meal-subscription';
import { BookCateringComponent } from './book-catering/book-catering';
import { VendorsComponent } from './vendors/vendors';
import { VendorDetailsComponent } from './vendor-details/vendor-details';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';

// Vendor-specific components
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard';
import { VendorMenuComponent } from './vendor-menu/vendor-menu';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings';
import { VendorLayoutComponent } from './vendor-layout/vendor-layout';

// ✅ NEW: Import Subscribers component
import { VendorSubscribersComponent } from './vendor-subscribers/vendor-subscribers';

export const routes: Routes = [
  // Authentication and role selection
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'role-select', component: RoleSelectComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Customer routes
  { path: 'home', component: CustomerHomeComponent },
  { path: 'profile', component: CustomerProfileComponent },

  // Vendor and admin routes
  { path: 'vendor-profile', component: VendorProfileComponent },
  { path: 'admin-profile', component: AdminProfileComponent },

  // General routes
  { path: 'menu', component: MenuComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'book-catering', component: BookCateringComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'vendor/:name', component: VendorDetailsComponent },

  // Vendor dashboard routes (nested inside VendorLayoutComponent)
  {
    path: '',
    component: VendorLayoutComponent,
    children: [
      { path: 'vendor-dashboard', component: VendorDashboardComponent },
      { path: 'vendor-menu', component: VendorMenuComponent },
      { path: 'vendor-orders', component: VendorOrdersComponent },
      { path: 'vendor-settings', component: VendorSettingsComponent },

      // ✅ NEW ROUTE ADDED HERE
      { path: 'vendor-subscribers', component: VendorSubscribersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}