import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu/menu';

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
  templateUrl: './admin-menu.html',
  styleUrls: ['./admin-menu.css']
})
export class AdminMenuComponent implements OnInit {

  // ✅ NEW (Admin)
  vendors: any[] = [];
  selectedVendorId!: number;

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
    private cdr: ChangeDetectorRef // ✅ Added ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVendors();
    this.loadCategories();
  }

  // ✅ Load Vendors
  loadVendors() {
    this.menuService.getVendors().subscribe({
      next: (res: any[]) => {
        this.vendors = res;

        if (res.length > 0) {
          this.selectedVendorId = res[0].vendorId;
          this.vendorId = this.selectedVendorId;
        }

        this.cdr.detectChanges(); // ✅ Detect changes after vendors load
      },
      error: err => console.error(err)
    });
  }

  // ✅ Vendor Change
  onVendorChange() {
    this.vendorId = this.selectedVendorId;
    this.pageNumber = 1;
    this.loadMenuItems();
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
      imageUrl: ''
    };
  }

  loadCategories() {
    this.menuService.getCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res.filter(c => c.isActive);

        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]);
        }

        this.cdr.detectChanges(); // ✅ Detect changes after categories load
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
    if (!this.vendorId || !this.selectedCategory) return;

    this.menuService.getAdminMenuItems(
      this.vendorId,
      this.selectedCategory.categoryId,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (res: MenuItem[]) => {
        this.menuItems = res;
        this.cdr.detectChanges(); // ✅ Detect changes after menu items load
      },
      error: err => console.error(err)
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.menuService.uploadImage(this.selectedFile).subscribe({
        next: res => {
          this.newItem.imageUrl = res.imageUrl;
          this.cdr.detectChanges(); // ✅ Detect changes after file upload
        }
      });
    }
  }

  addMenuItem() {
    this.newItem.vendorId = this.selectedVendorId;
    this.newItem.categoryId = this.selectedCategory.categoryId;

    this.menuService.addMenuItem(this.newItem).subscribe({
      next: () => {
        this.loadMenuItems();
        this.resetForm();
        this.cdr.detectChanges(); // ✅ Detect changes after add
      }
    });
  }

  editItem(item: MenuItem) {
    this.editingItem = { ...item };
    this.cdr.detectChanges(); // ✅ Detect changes when editing
  }

  saveEdit() {
    if (!this.editingItem) return;

    this.menuService.updateMenuItem(
      this.editingItem.menuItemId!,
      this.editingItem
    ).subscribe(() => {
      this.loadMenuItems();
      this.editingItem = null;
      this.cdr.detectChanges(); // ✅ Detect changes after edit
    });
  }

  deleteItem(menuItemId?: number) {
    if (!menuItemId) return;

    this.menuService.deleteMenuItem(menuItemId).subscribe(() => {
      this.loadMenuItems();
      this.cdr.detectChanges(); // ✅ Detect changes after delete
    });
  }

  cancelEdit() {
    this.editingItem = null;
    this.cdr.detectChanges(); // ✅ Detect changes after cancel
  }

  resetForm() {
    this.newItem = this.getEmptyItem();
    this.showForm = false;
    this.selectedFile = null;
    this.cdr.detectChanges(); // ✅ Detect changes after reset
  }

  toggleSoldOut(item: MenuItem) {
    const updatedItem = { ...item, isAvailable: !item.isAvailable };

    this.menuService.updateMenuItem(item.menuItemId!, updatedItem).subscribe(() => {
      const index = this.menuItems.findIndex(m => m.menuItemId === item.menuItemId);
      if (index !== -1) {
        this.menuItems[index].isAvailable = updatedItem.isAvailable;
      }
      this.cdr.detectChanges(); // ✅ Detect changes after toggle
    });
  }
}