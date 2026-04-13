import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminProfileUpdate {
  userId: number;
  ownerName?: string;
  email?: string;
  password?: string;
}

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: number;
  vendorName: string;
  vendorId :number;
  orderStatus: string;
  statusId : number;
  deliveryAddress: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];

  fullname: string;
  email: string;
  phone: string;

  expanded?: boolean;
}

export interface Customer {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  status: string,
  roleName: string;
  subscriptionName: string;
  createdAt: string;
}

export interface CustomerDetailsResponse {
  user: Customer;
  orders: {
    data: Order[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  totalOrders: number;
  totalRevenue: number;
  topOrderedItem: {
    menuItemId: number;
    itemName: string;
    totalQuantitySold: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminCustomerService {
  private apiUrl = ' https://biconical-sara-counteractive.ngrok-free.dev/api/admincustomeruser'; // your API URL

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerDetails(userId: number, pageNumber: number = 1, pageSize: number = 10): Observable<CustomerDetailsResponse> {
  return this.http.get<CustomerDetailsResponse>(
    `${this.apiUrl}/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

getAllOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/allorders`);
}

deleteCustomer(userId: number) {
  return this.http.delete(`${this.apiUrl}/${userId}`);
}

updateProfile(payload: AdminProfileUpdate) {
    return this.http.post(`${this.apiUrl}/update-profile`, payload);
  }
}
