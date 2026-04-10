import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://a711-192-197-60-11.ngrok-free.app/api/payment';

  constructor(private http: HttpClient) {}

  // ✅ CREATE STRIPE PAYMENT INTENT
  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/create-intent?amount=${amount}`,
      {}
    );
  }

  // ✅ CONFIRM PAYMENT
  confirmPayment(orderId: number, paymentIntentId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/confirm?orderId=${orderId}&paymentIntentId=${paymentIntentId}`,
      {}
    );
  }

  // ✅ SHIP ORDER (ADMIN / TEST)
  shipOrder(orderId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/ship/${orderId}`,
      {}
    );
  }
}