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

  private apiUrl = "http://localhost:5197/api/auth";

  constructor(private http: HttpClient) {}

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
}