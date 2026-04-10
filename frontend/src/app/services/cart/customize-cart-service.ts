import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionCartService {

  private items: any[] = [];
  private mealsLimit = 0;

  constructor(private http: HttpClient) {
    this.loadFromStorage(); // ✅ LOAD ON INIT
  }

    private baseUrl = 'http://localhost:5197/api/subscription-order';


    deleteSubscriber(userId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}`);
}

confirmSubscriptionPlan(data: any) {
  return this.http.post(`${this.baseUrl}/subscription-plan/confirm`, data);
}


  // ✅ STORAGE SAVE
  private save() {
    localStorage.setItem('subscription_cart', JSON.stringify(this.items));
  }

  // ✅ STORAGE LOAD
  private loadFromStorage() {
    const data = localStorage.getItem('subscription_cart');
    this.items = data ? JSON.parse(data) : [];
  }

  setMealsLimit(limit: number) {
    this.mealsLimit = limit;
  }

  getMealsLimit() {
    return this.mealsLimit;
  }

  getItems() {
    return this.items;
  }

  getTotalQuantity() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  addToCart(item: any) {

    const totalQty = this.getTotalQuantity();

    if (this.mealsLimit && totalQty >= this.mealsLimit) {
      alert(`You can only add ${this.mealsLimit} meals`);
      return false;
    }

    const existing = this.items.find(i => i.menuItemId === item.menuItemId);

    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }

    this.save(); // ✅ SAVE AFTER ADD

    return true;
  }

  increase(index: number) {

    const totalQty = this.getTotalQuantity();

    if (this.mealsLimit && totalQty >= this.mealsLimit) {
      alert("Meal limit reached");
      return;
    }

    this.items[index].quantity++;
    this.save(); // ✅ SAVE
  }

  decrease(index: number) {
    if (this.items[index].quantity > 1) {
      this.items[index].quantity--;
    } else {
      this.remove(index);
      return;
    }

    this.save(); // ✅ SAVE
  }

  remove(index: number) {
    this.items.splice(index, 1);
    this.save(); // ✅ SAVE
  }

  clear() {
    this.items = [];
    localStorage.removeItem('subscription_cart');
  }

  clearCart() {
  this.items = [];
}
}