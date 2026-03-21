import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  baseUrl = 'http://localhost:5197/api/vendor';

  constructor(private http: HttpClient) {}

  

  getSubscribers(vendorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${vendorId}/subscribers`);
  }

  updateSubscriber(vendorId: number, subscriberId: number, payload: any): Observable<any> {
    // payload must be JSON object
    return this.http.put(`${this.baseUrl}/${vendorId}/subscriber/${subscriberId}`, payload);
  }

  getOrders(vendorId: number) {
  return this.http.get(`${this.baseUrl}/${vendorId}/orders`);
}
updateOrder(vendorId: number, orderId: number, payload: any) {
  return this.http.put(`${this.baseUrl}/${vendorId}/order/${orderId}`, payload);
}

getDashboard(vendorId: number) {
  return this.http.get(`${this.baseUrl}/${vendorId}/dashboard`);
}

getVendorProfile(userId: number) {
  return this.http.get(`${this.baseUrl}/${userId}/profile`);
}

saveVendorProfile(formData: FormData) {
  return this.http.post(`${this.baseUrl}/profile`, formData);
}

getVendorByUserId(userId: number) {
  return this.http.get(`${this.baseUrl}/by-user/${userId}`);

}
}