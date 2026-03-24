import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RevenueByDay {
  day: string;
  revenue: number;
}

export interface AdminDashboard {
  vendorsCount: number;
  customersCount: number;
  ordersCount: number;
  totalRevenue: number;
  revenueByDay: RevenueByDay[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private apiUrl = 'http://localhost:5197/api/AdminDashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(this.apiUrl);
  }
}