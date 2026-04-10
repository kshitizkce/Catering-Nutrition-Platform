import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = 'https://a711-192-197-60-11.ngrok-free.app/api/CustomerProfile';

  constructor(private http: HttpClient) {}

 

  // ✅ Addresses
  getAddresses(userId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/addresses`);
  }

  // ✅ Payments
  getPayments(userId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}/payments`);
  }

  // ✅ Stripe Payment Intent
  createPaymentIntent(amount: number) {
    return this.http.post(`${this.baseUrl}/payment/create-intent`, amount);
  }

  // ✅ Confirm Payment
  confirmPayment(data: any) {
    return this.http.post(`${this.baseUrl}/payment/confirm`, data);
  }
}