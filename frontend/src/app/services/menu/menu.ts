import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItemDto } from '../../models/menu-item-dto';


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
//get menu items by vendor id and category id with pagination feature
getMenuByVendorAndCategoryApi(
  vendorId: number,
  categoryIds: number[],
  pageNumber: number = 1,
  pageSize: number = 50
): Observable<any[]> {
  return this.http.post<any[]>(
    `${this.api}/menuitems/vendor/categories/${vendorId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    categoryIds
  );
}

addMenuItem(dto: MenuItemDto): Observable<any> {
    return this.http.post(`${this.api}/menuitems`, dto);
  }

  updateMenuItem(menuItemId: number, dto: MenuItemDto): Observable<any> {
    return this.http.put(`${this.api}/menuitems/${menuItemId}`, dto);
  }

  deleteMenuItem(menuItemId: number): Observable<any> {
    return this.http.delete(`${this.api}/menuitems/${menuItemId}`);
  }

  // Optional: upload image to a server (if using real backend storage)
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.api}/upload-image`, formData);
  }

  getAdminMenuItems(vendorId: number, categoryId: number, pageNumber: number, pageSize: number) {
  return this.http.get<any[]>(
    `${this.api}/admin/menuitems?vendorId=${vendorId}&categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}


}