 import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {

  private baseUrl = 'https://a711-192-197-60-11.ngrok-free.app/api/CustomerProfile';

  constructor(private http: HttpClient) {}

  getSubscriber(userId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/userSubscription/${userId}`);
}

updateProfile(id: number, data: any) {
  return this.http.put(`${this.baseUrl}/${id}`, data, {
    responseType: 'text' as 'json'
  });
}

getAddresses(userId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/${userId}/addresses`);
}

getPayments(userId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/${userId}/payments`);
}

addAddress(userId: number, data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/${userId}/address`, data);
}

addPayment(userId: number, data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/${userId}/payment`, data);
}
deleteAddress(userId: number) {
  return this.http.delete(`${this.baseUrl}/address/${userId}`);
}

deletePayment(userId: number) {
  return this.http.delete(`${this.baseUrl}/payment/${userId}`);
}
}