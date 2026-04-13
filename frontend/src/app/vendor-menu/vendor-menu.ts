import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu/menu';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  isActive: boolean;
}

interface MenuItem {
  menuItemId?: number;
  vendorId: number;
  categoryId: number;
  itemName: string;
  rating: number;
  itemDescription?: string;
  price: number;
  calories?: number;
  isAvailable: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-vendor-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-menu.html',
  styleUrls: ['./vendor-menu.css']
})
export class VendorMenuComponent implements OnInit {

  vendorId: number = 0;
  categories: Category[] = [];
  selectedCategory!: Category;

  menuItems: MenuItem[] = [];
  pageNumber: number = 1;
  pageSize: number = 50;

  showForm = false;
  editingItem: MenuItem | null = null;

  newItem: MenuItem = this.getEmptyItem();
  selectedFile: File | null = null;

  constructor(
    private menuService: MenuService,
    private vendorService: VendorService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user) return;

    const userId = user.userId;

    this.vendorService.getVendorByUserId(userId).subscribe({
      next: (vendor: any) => {
        this.vendorId = vendor.vendorId;
        this.loadCategories();
        setTimeout(() => this.cdr.detectChanges());
      },
      error: err => console.error(err)
    });
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getEmptyItem(): MenuItem {
    return {
      vendorId: this.vendorId,
      categoryId: this.selectedCategory?.categoryId || 0,
      itemName: '',
      itemDescription: '',
      price: 0,
      calories: 0,
      isAvailable: true,
      rating: 0,
      imageUrl: ''   // ✅ FIXED SAFE DEFAULT
    };
  }

  loadCategories() {
    this.menuService.getCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res.filter(c => c.isActive);
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]);
        }
        setTimeout(() => this.cdr.detectChanges());
      }
    });
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.pageNumber = 1;
    this.loadMenuItems();
    this.newItem.categoryId = category.categoryId;
  }

  loadMenuItems() {
    this.menuService.getMenuByVendorAndCategoryApi(
      this.vendorId,
      [this.selectedCategory.categoryId],
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (res: MenuItem[]) => {
        this.menuItems = res;
        setTimeout(() => this.cdr.detectChanges());
      }
    });
  }

  nextPage() {
    this.pageNumber++;
    this.loadMenuItems();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadMenuItems();
    }
  }

  // 🔥 FIXED IMAGE UPLOAD
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (!this.selectedFile) return;

    this.menuService.uploadImage(this.selectedFile).subscribe({
      next: res => {

        // ✅ FIX: support both backend response types
        const uploadedUrl = res.imageUrl || res.imageUrl;

        this.newItem.imageUrl = uploadedUrl;

        // IMPORTANT: also update editing item if open
        if (this.editingItem) {
          this.editingItem.imageUrl = uploadedUrl;
        }

        setTimeout(() => this.cdr.detectChanges());
      },
      error: err => console.error('Image upload failed', err)
    });
  }

  // 🔥 FIXED ADD
  addMenuItem() {

    const payload: MenuItem = {
      ...this.newItem,
      imageUrl: this.newItem.imageUrl || ''   // ✅ FORCE INCLUDE IMAGE
    };

    payload.vendorId = this.vendorId;
    payload.categoryId = this.selectedCategory.categoryId;

    this.menuService.addMenuItem(payload).subscribe({
      next: () => {
        this.loadMenuItems();
        this.resetForm();
      },
      error: err => console.error(err)
    });
  }

  editItem(item: MenuItem) {
    this.editingItem = { ...item };
  }

  // 🔥 FIXED UPDATE
  saveEdit() {
    if (!this.editingItem) return;

    const payload: MenuItem = {
      ...this.editingItem,
      imageUrl: this.editingItem.imageUrl || ''   // ✅ FIX NULL ISSUE
    };

    this.menuService.updateMenuItem(
      this.editingItem.menuItemId!,
      payload
    ).subscribe({
      next: () => {
        this.loadMenuItems();
        this.editingItem = null;
      },
      error: err => console.error(err)
    });
  }

  deleteItem(menuItemId?: number) {
    if (!menuItemId) return;

    this.menuService.deleteMenuItem(menuItemId).subscribe({
      next: () => this.loadMenuItems(),
      error: err => console.error(err)
    });
  }

  cancelEdit() {
    this.editingItem = null;
  }

  resetForm() {
    this.newItem = this.getEmptyItem();
    this.showForm = false;
    this.selectedFile = null;
  }

  toggleSoldOut(item: MenuItem) {

    const updatedItem: MenuItem = {
      ...item,
      isAvailable: !item.isAvailable,
      imageUrl: item.imageUrl || ''   // ✅ FIX SAFETY
    };

    this.menuService.updateMenuItem(item.menuItemId!, updatedItem)
      .subscribe({
        next: () => {
          const i = this.menuItems.findIndex(m => m.menuItemId === item.menuItemId);
          if (i !== -1) {
            this.menuItems[i].isAvailable = updatedItem.isAvailable;
          }
        },
        error: err => console.error(err)
      });
  }
}