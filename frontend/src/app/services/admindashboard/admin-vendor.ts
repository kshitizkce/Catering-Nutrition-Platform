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
  city: string;
  status: string;

  // 🔥 NEW FIELDS
  vendorAddress?: string;
  rating?: number;
  businessHours?: string;
  businessLogo?: string;
  businessFile?: string;
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
  private apiBase = 'https://a711-192-197-60-11.ngrok-free.app/api/adminvendor';
  private fileApibase = 'https://a711-192-197-60-11.ngrok-free.app';

  constructor(private http: HttpClient) {}

  getVendorDetails(vendorId: number, pageNumber = 1, pageSize = 10): Observable<VendorDetailsResponse> {
    return this.http.get<VendorDetailsResponse>(`${this.apiBase}/${vendorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllVendors(): Observable<Vendor[]> {
  return this.http.get<Vendor[]>(`${this.apiBase}/all`);
}

deleteVendor(vendorId: number) {
  return this.http.delete(`${this.apiBase}/${vendorId}`);
}

getVendorFileUrlfromApi(filePath: string): string {
  if (!filePath) return ''; // handle empty file

  // Remove leading slash and 'uploads/' if present
  const fileName = filePath.replace(/^\/?uploads\//, ''); 
  // Explanation:
  // ^     = start of string
  // /?    = optional leading slash
  // uploads/ = literal string
  // Result: "378e3559-06bc-483e-bd43-6c5e8f52aff3.png"

  return `${this.fileApibase}/uploads/${fileName}`;
}

approveVendor(vendorId: number) {
  return this.http.put<Vendor>(`${this.apiBase}/approve/${vendorId}`, {});
}

rejectVendor(vendorId: number) {
  return this.http.put<Vendor>(`${this.apiBase}/reject/${vendorId}`, {});
}

sendVendorEmail(payload: { toEmail: string; subject?: string; message: string }) {
  return this.http.post(`${this.apiBase}/send-email`, payload, { responseType: 'text' });
}

}