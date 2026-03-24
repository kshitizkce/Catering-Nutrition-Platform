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

// Admin components
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { AdminVendorsComponent } from './admin-vendors/admin-vendors';
import { AdminOrdersComponent } from './admin-orders/admin-orders';
import { AdminCustomersComponent } from './admin-customers/admin-customers';
import { AdminVendorDetailsComponent } from './admin-vendor-details/admin-vendor-details';
import { AdminCustomerDetailsComponent } from './admin-customer-details/admin-customer-details'; // ✅ FIX

// Vendor components
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard';
import { VendorMenuComponent } from './vendor-menu/vendor-menu';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings';
import { VendorLayoutComponent } from './vendor-layout/vendor-layout';
import { VendorSubscribersComponent } from './vendor-subscribers/vendor-subscribers';
import { AdminMenuComponent } from './admin-menu/admin-menu';

export const routes: Routes = [

  // Authentication
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'role-select', component: RoleSelectComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Customer
  { path: 'home', component: CustomerHomeComponent },
  { path: 'profile', component: CustomerProfileComponent },

  // Profiles
  { path: 'vendor-profile', component: VendorProfileComponent },
  { path: 'admin-profile', component: AdminProfileComponent },

  // General
  { path: 'menu', component: MenuComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'book-catering', component: BookCateringComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'vendor/:name', component: VendorDetailsComponent },

  // ✅ ADMIN ROUTES
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'admin-vendors', component: AdminVendorsComponent },
      { path: 'admin-orders', component: AdminOrdersComponent },
      { path: 'admin-menu', component: AdminMenuComponent },
      { path: 'admin-customers', component: AdminCustomersComponent },
      { path: 'admin-customer-details/:id', component: AdminCustomerDetailsComponent },
      { path: 'admin-vendor-details/:id', component: AdminVendorDetailsComponent },
      { path: 'admin-dashboard', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // ✅ VENDOR ROUTES
  {
    path: '',
    component: VendorLayoutComponent,
    children: [
      { path: 'vendor-dashboard', component: VendorDashboardComponent },
      { path: 'vendor-menu', component: VendorMenuComponent },
      { path: 'vendor-orders', component: VendorOrdersComponent },
      { path: 'vendor-settings', component: VendorSettingsComponent },
      { path: 'vendor-subscribers', component: VendorSubscribersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}