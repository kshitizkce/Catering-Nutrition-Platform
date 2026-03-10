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
}