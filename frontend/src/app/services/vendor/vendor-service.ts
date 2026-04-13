import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  baseUrl = ' https://biconical-sara-counteractive.ngrok-free.dev/api/vendor';

  constructor(private http: HttpClient) {}

  

  getSubscribers(vendorId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${vendorId}/subscribers`);
  }

  getSubscriber(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sub/${userId}`);
  }

  updateSubscriber(vendorId: number ,subscriberId: number, payload: any) {
  return this.http.put(
    `${this.baseUrl}/update/${subscriberId}`,
    payload
  );
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
getUserDetails(userId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/user/${userId}`);
  }

   getMealCateringVendors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/meal-catering`);
  }

  getVendors() {
    return this.http.get<any[]>(`${this.baseUrl}/vendors`);
  }

  createSubscription(data: any) {
  return this.http.post(`${this.baseUrl}/create`, data);
}

 
}