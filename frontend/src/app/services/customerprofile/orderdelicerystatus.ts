import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://a711-192-197-60-11.ngrok-free.app/api/deliveryStatus';

  constructor(private http: HttpClient) {}

  // Get order status from the backend
  getOrderStatus(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }

  // Update the delivery status
  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    const statusUpdate = { DeliveryStatus: newStatus, OrderStatusId: 2 };  // Example OrderStatusId
    return this.http.put(`${this.apiUrl}/${orderId}/update-status`, statusUpdate);
  }

  getLatestOrder(userId: number) {
  return this.http.get(`${this.apiUrl}/latest/${userId}`);
}
}