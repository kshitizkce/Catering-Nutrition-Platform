import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  subscriptionTypeId: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: any;

  setUser(user: any) {
  this.currentUser = user;
  localStorage.setItem('user', JSON.stringify(user)); // ✅ persist
}

getUser() {
  if (!this.currentUser) {
    const data = localStorage.getItem('user');
    if (data) {
      this.currentUser = JSON.parse(data);
    }
  }
  return this.currentUser;
}

getUserId() {
  return this.getUser()?.userId;
}

getVendorId() {
  return this.getUser()?.vendorId;
}

  private apiUrl = "https://a711-192-197-60-11.ngrok-free.app/api/auth";

  constructor(private http: HttpClient) {
  const user = localStorage.getItem('user');
  if (user) {
    this.currentUser = JSON.parse(user);
  }
}

  register(data: RegisterDto, roleType: 'customer' | 'vendor'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register?roleType=${roleType}`, data);
  }

  login(data: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
  sendEmailOtp(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/send-email-otp`, { email });
}

verifyEmailOtp(email: string, otp: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/verify-email-otp`, { email, otp });
}

sendPhoneOtp(phone: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/send-sms-otp`, { phone });
}

verifyPhoneOtp(phone: string, otp: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/verify-sms-otp`, { phone, otp });
}
logout(){
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // if you store JWT
}
}
