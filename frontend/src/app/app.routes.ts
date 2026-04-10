import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Common/Customer components
import { SignupComponent } from './signup/signup';
import { RoleSelectComponent } from './role-select/role-select';
import { CustomerHomeComponent } from './customer-home/customer-home';
import { CustomerProfileComponent } from './customer-profile/customer-profile';
import { VendorProfileComponent } from './vendor-profile/vendor-profile';
import { AdminProfileComponent } from './admin-profile/admin-profile';
import { MenuComponent } from './menu/menu';
import { SubscriptionComponent } from './meal-subscription/meal-subscription';
import { CartComponent } from './cart/cart';
import { OrderSuccessComponent } from './order-success/order-success';
import { DeliveryTrackingComponent } from './delivery-tracking/delivery-tracking';


import { SubscriptionCartComponent } from './subscriptioncart/subscriptioncart';


import {CheckoutComponent} from './checkout/checkout'
import { BookCateringComponent } from './book-catering/book-catering';
import { VendorsComponent } from './vendors/vendors';
import { VendorDetailsComponent } from './vendor-details/vendor-details';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';
import { VendorMealCatering } from './vendor-meal-catering/vendor-meal-catering';






// Admin components
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { AdminVendorsComponent } from './admin-vendors/admin-vendors';
import { AdminOrdersComponent } from './admin-orders/admin-orders';
import { AdminCustomersComponent } from './admin-customers/admin-customers';
import { AdminVendorDetailsComponent } from './admin-vendor-details/admin-vendor-details';
import { AdminCustomerDetailsComponent } from './admin-customer-details/admin-customer-details'; // ✅ FIX
import { AdminMealCatering } from './admin-meal-catering/admin-meal-catering';


// Vendor components
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard';
import { VendorMenuComponent } from './vendor-menu/vendor-menu';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings';
import { VendorLayoutComponent } from './vendor-layout/vendor-layout';
import { VendorSubscribersComponent } from './vendor-subscribers/vendor-subscribers';
import { AdminMenuComponent } from './admin-menu/admin-menu';
import { MealCateringGuard } from './vendor-meal-catering/vendor-meal-guard-catering';
import { CustomizeMealComponent } from './customize-meal/customize-meal';




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
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
    { path: 'order-success', component: OrderSuccessComponent },
    
        { path: 'subscriptioncart', component: SubscriptionCartComponent },
                { path: 'deliverytracking', component: DeliveryTrackingComponent },




  // Profiles
  { path: 'vendor-profile', component: VendorProfileComponent },

  // General
  { path: 'menu', component: MenuComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'book-catering', component: BookCateringComponent },
  { path: 'vendors', component: VendorsComponent },
          { path: 'vendor-details/:vendorId', component: VendorDetailsComponent },
          {
  path: 'customize-meal/:id',
  component: CustomizeMealComponent
},


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
      { path: 'vendor-subscribers', component: VendorSubscribersComponent },
      { path: 'admin-profile', component: AdminProfileComponent },
            { path: 'admin-meal-catering', component: AdminMealCatering },
      { path: 'admin-customer-details/:id', component: AdminCustomerDetailsComponent },
      { path: 'admin-vendor-details/:id', component: AdminVendorDetailsComponent },
      { path: 'admin-dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'vendor/:id', component: AdminVendorDetailsComponent }
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
      { path: 'vendor-meal-catering', component: VendorMealCatering }, 

      {
  path: 'vendor-meal-catering',
  loadComponent: () => import('./vendor-meal-catering/vendor-meal-catering')
    .then(m => m.VendorMealCatering),
  canActivate: [MealCateringGuard] // ✅ ADD THIS
}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}