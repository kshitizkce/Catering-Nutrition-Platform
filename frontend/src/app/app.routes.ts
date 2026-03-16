import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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

export const routes: Routes = [
  { path:'', redirectTo: '/signup', pathMatch: 'full' },
  { path:'signup', component: SignupComponent },
  { path:'role-select', component: RoleSelectComponent },
  { path:'forgot-password', component: ForgotPasswordComponent },
  { path:'reset-password', component: ResetPasswordComponent },
  { path:'home', component: CustomerHomeComponent },
  { path:'profile', component: CustomerProfileComponent },
  { path:'vendor-profile', component: VendorProfileComponent },
  { path:'admin-profile', component: AdminProfileComponent },
  { path:'menu', component: MenuComponent },
  { path:'subscription', component: SubscriptionComponent },
  { path:'book-catering', component: BookCateringComponent },
  { path:'vendors', component: VendorsComponent },
  { path:'vendor/:name', component: VendorDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}