import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'https://a711-192-197-60-11.ngrok-free.app/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(data: any) {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  getCart(userId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`);
  }

  checkout(data: any) {
    return this.http.post(`${this.baseUrl}/checkout`, data);
  }
  updateQuantity(cartItemId: number, quantity: number) {
  return this.http.put(`${this.baseUrl}/update?cartItemId=${cartItemId}&quantity=${quantity}`, {});
}

removeItem(cartItemId: number) {
  return this.http.delete(`${this.baseUrl}/remove/${cartItemId}`);
}
}