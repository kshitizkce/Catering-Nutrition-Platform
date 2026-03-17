import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private api = 'http://localhost:5197/api/menu';

  // http://localhost:5197/api/menu/categories

  constructor(private http: HttpClient) {}

  /* GET ALL VENDORS */

  getVendors(): Observable<any> {
    return this.http.get(`${this.api}/vendors`);
  }

  /* GET MENU ITEMS BY VENDOR */

  getVendorMenu(vendorId: number): Observable<any> {
    return this.http.get(`${this.api}/menuitems/vendor/${vendorId}`);
  }

  /* GET ALL CATEGORIES */

  getCategories(): Observable<any> {
    return this.http.get(`${this.api}/categories`);
  }

  /* GET MENU ITEMS BY CATEGORY (POST) */
getMenuByCategoryApi(categoryIds: number[]): Observable<any> {
  return this.http.post(`${this.api}/menuitems/categories`, categoryIds);
}

  /* ADD MENU ITEM */

  addMenuItem(data: any): Observable<any> {
    return this.http.post(`${this.api}/menuitems`, data);
  }

  /* DELETE MENU ITEM */

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.api}/menuitems/${id}`);
  }

  /* UPDATE MENU ITEM */

  updateMenuItem(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/menuitems/${id}`, data);
  }

}