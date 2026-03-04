import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup';
import { CustomerProfileComponent } from './customer-profile/customer-profile';
import { CustomerHomeComponent } from './customer-home/customer-home';
import { VendorProfileComponent } from './vendor-profile/vendor-profile';
import { AdminProfileComponent } from './admin-profile/admin-profile';

export const routes: Routes = [

  { path: '', component: SignupComponent },

  { path: 'home', component: CustomerHomeComponent },

  { path: 'profile', component: CustomerProfileComponent },

  { path: 'vendor-profile', component: VendorProfileComponent },

  { path: 'admin-profile', component: AdminProfileComponent }

];