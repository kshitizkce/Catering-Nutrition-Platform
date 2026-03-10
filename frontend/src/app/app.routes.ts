import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup';
import { CustomerHomeComponent } from './customer-home/customer-home';
import { CustomerProfileComponent } from './customer-profile/customer-profile';
import { VendorProfileComponent } from './vendor-profile/vendor-profile';
import { AdminProfileComponent } from './admin-profile/admin-profile';
import { MenuComponent } from './menu/menu';
import { SubscriptionComponent } from './meal-subscription/meal-subscription';
import { BookCateringComponent } from './book-catering/book-catering';
import { VendorsComponent } from './vendors/vendors';
import { VendorDetailsComponent } from './vendor-details/vendor-details';

export const routes: Routes = [

{ path:'', component:SignupComponent },

{ path:'home', component:CustomerHomeComponent },

{ path:'profile', component:CustomerProfileComponent },

{ path:'vendor-profile', component:VendorProfileComponent },

{ path:'admin-profile', component:AdminProfileComponent },

{ path:'menu', component:MenuComponent },

{ path:'subscription', component:SubscriptionComponent },

{ path:'book-catering', component:BookCateringComponent },

{ path:'vendors', component:VendorsComponent },

{ path:'vendor/:name', component:VendorDetailsComponent }

];