import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface Vendor {
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  city?: string;
  status: string;
}

export interface VendorDetailsResponse {
  vendor: Vendor;
  totalOrders: number;
  totalRevenue: number;
  orders: {
    data: Order[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  topSellingItem: {
    menuItemId: number;
    itemName: string;
    totalQuantitySold: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminVendorService {
  private apiBase = 'http://localhost:5197/api/adminvendor';

  constructor(private http: HttpClient) {}

  getVendorDetails(vendorId: number, pageNumber = 1, pageSize = 10): Observable<VendorDetailsResponse> {
    return this.http.get<VendorDetailsResponse>(`${this.apiBase}/${vendorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllVendors(): Observable<Vendor[]> {
  return this.http.get<Vendor[]>(`${this.apiBase}/all`);
}
}