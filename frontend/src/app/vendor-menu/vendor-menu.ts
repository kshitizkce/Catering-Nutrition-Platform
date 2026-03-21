import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu/menu';
import { VendorService}from '../services/vendor/vendor-service';
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
  rating :number,
  itemDescription?: string;
  price: number;
  calories?: number;
  isAvailable: boolean;
  imageUrl?: string; // updated for backend
}

@Component({
  selector: 'app-vendor-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-menu.html',
  styleUrls: ['./vendor-menu.css']
})
export class VendorMenuComponent implements OnInit {
vendorId: number = 0; // default
  categories: Category[] = [];
  selectedCategory!: Category;

  menuItems: MenuItem[] = [];
  pageNumber: number = 1;
  pageSize: number = 50;

  showForm = false;
  editingItem: MenuItem | null = null;

  newItem: MenuItem = this.getEmptyItem();
  selectedFile: File | null = null;

  constructor(private menuService: MenuService,
    private vendorService :VendorService,
        private authService : AuthService

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

  // ✅ Step 1: get vendorId from backend
  this.vendorService.getVendorByUserId(userId).subscribe({
    next: (vendor: any) => {
      this.vendorId = vendor.vendorId;

      if (!this.vendorId) {
        console.error("Vendor ID not found");
        return;
      }

      // ✅ Step 2: NOW load categories
      this.loadCategories();
    },
    error: (err) => {
      console.error("Failed to fetch vendor:", err);
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
      rating : 0,
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
      },
      error: err => console.error('Failed to load categories', err)
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
      next: (res: MenuItem[]) => this.menuItems = res,
      error: err => console.error('Failed to load menu items', err)
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
    // If using actual upload API:
    if (this.selectedFile) {
    this.menuService.uploadImage(this.selectedFile).subscribe({
      next: res => {
        this.newItem.imageUrl = res.imageUrl; // store URL returned by API
      },
      error: err => console.error('Image upload failed', err)
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
      },
      error: err => console.error('Failed to add menu item', err)
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
      },
      error: err => console.error('Failed to update menu item', err)
    });
  }

  deleteItem(menuItemId?: number) {
    if (!menuItemId) return;

    this.menuService.deleteMenuItem(menuItemId).subscribe({
      next: () => this.loadMenuItems(),
      error: err => console.error('Failed to delete menu item', err)
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
  // Flip the isAvailable flag
  const updatedItem = { ...item, isAvailable: !item.isAvailable };

  // Call update API
  this.menuService.updateMenuItem(item.menuItemId!, updatedItem).subscribe({
    next: () => {
      // Update the item in the local array
      const index = this.menuItems.findIndex(m => m.menuItemId === item.menuItemId);
      if (index !== -1) {
        this.menuItems[index].isAvailable = updatedItem.isAvailable;
      }
    },
    error: err => console.error('Failed to toggle availability', err)
  });
}
}