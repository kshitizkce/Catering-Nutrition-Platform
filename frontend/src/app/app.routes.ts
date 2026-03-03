import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup';

export const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signup', component: SignupComponent }
];