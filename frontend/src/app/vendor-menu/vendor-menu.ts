import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu/menu';
import { VendorService } from '../services/vendor/vendor-service';
import { AuthService } from '../services/auth/auth';

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
    private cdr: ChangeDetectorRef   // ✅ added
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const userId = user.userId;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    this.vendorService.getVendorByUserId(userId).subscribe({
      next: (vendor: any) => {
        this.vendorId = vendor.vendorId;

        if (!this.vendorId) {
          console.error("Vendor ID not found");
          return;
        }

        this.loadCategories();

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: (err) => {
        console.error("Failed to fetch vendor:", err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
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

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to load categories', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.pageNumber = 1;
    this.loadMenuItems();
    this.newItem.categoryId = category.categoryId;

    setTimeout(() => this.cdr.detectChanges()); // ✅ safe
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
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to load menu items', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.menuService.uploadImage(this.selectedFile).subscribe({
        next: res => {
          this.newItem.imageUrl = res.imageUrl;
          setTimeout(() => this.cdr.detectChanges()); // ✅ safe
        },
        error: err => {
          console.error('Image upload failed', err);
          setTimeout(() => this.cdr.detectChanges()); // ✅ safe
        }
      });
    }
  }

  addMenuItem() {
    this.newItem.vendorId = this.vendorId;
    this.newItem.categoryId = this.selectedCategory.categoryId;

    this.menuService.addMenuItem(this.newItem).subscribe({
      next: () => {
        this.loadMenuItems();
        this.resetForm();
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to add menu item', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }

  editItem(item: MenuItem) {
    this.editingItem = { ...item };
  }

  saveEdit() {
    if (!this.editingItem) return;

    this.menuService.updateMenuItem(this.editingItem.menuItemId!, this.editingItem).subscribe({
      next: () => {
        this.loadMenuItems();
        this.editingItem = null;
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to update menu item', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }

  deleteItem(menuItemId?: number) {
    if (!menuItemId) return;

    this.menuService.deleteMenuItem(menuItemId).subscribe({
      next: () => {
        this.loadMenuItems();
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to delete menu item', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }

  cancelEdit() {
    this.editingItem = null;
  }

  resetForm() {
    this.newItem = this.getEmptyItem();
    this.showForm = false;
    this.selectedFile = null;

    setTimeout(() => this.cdr.detectChanges()); // ✅ safe
  }

  toggleSoldOut(item: MenuItem) {
    const updatedItem = { ...item, isAvailable: !item.isAvailable };

    this.menuService.updateMenuItem(item.menuItemId!, updatedItem).subscribe({
      next: () => {
        const index = this.menuItems.findIndex(m => m.menuItemId === item.menuItemId);
        if (index !== -1) {
          this.menuItems[index].isAvailable = updatedItem.isAvailable;
        }

        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      },
      error: err => {
        console.error('Failed to toggle availability', err);
        setTimeout(() => this.cdr.detectChanges()); // ✅ safe
      }
    });
  }
}