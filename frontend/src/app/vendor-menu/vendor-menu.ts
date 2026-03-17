import { Component, OnInit } from '@angular/core';
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
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  image: string;
  vegetarian: boolean;
  popular: boolean;
  soldOut: boolean;
  category: string;
}

@Component({
  selector: 'app-vendor-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-menu.html',
  styleUrls: ['./vendor-menu.css']
})
export class VendorMenuComponent implements OnInit {

  categories: Category[] = [];
  selectedCategory!: Category; // full object including categoryId

  menuItems: MenuItem[] = []; // will be loaded from API

  newItem: MenuItem = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    calories: 0,
    protein: 0,
    image: '',
    vegetarian: false,
    popular: false,
    soldOut: false,
    category: ''
  };

  showForm = false;
  editingItem: MenuItem | null = null;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Load categories from API
  loadCategories() {
    this.menuService.getCategories().subscribe({
      next: (res: Category[]) => {
        this.categories = res.filter(c => c.isActive);
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0]); // select first by default
        }
      },
      error: (err: any) => console.error('Failed to load categories', err)
    });
  }

  // When a category is clicked
  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.loadMenuItemsForCategory(category.categoryId);
  }

  // Load menu items for selected category
  loadMenuItemsForCategory(categoryId: number) {
    this.menuService.getMenuByCategoryApi([categoryId]).subscribe({
      next: (res: any[]) => {
        this.menuItems = res.map(item => ({
          id: item.menuItemId,
          name: item.itemName,
          description: item.itemDescription,
          price: item.price,
          calories: item.calories,
          protein: item.protein || 0,
          image: item.image || '',
          vegetarian: item.vegetarian || false,
          popular: item.popular || false,
          soldOut: !item.isAvailable,
          category: this.selectedCategory.categoryName
        }));
      },
      error: (err: any) => console.error('Failed to load menu items', err)
    });
  }

  get filteredItems() {
    return this.menuItems;
  }

  addMenuItem() {
    const newId = this.menuItems.length + 1;
    this.menuItems.push({
      ...this.newItem,
      id: newId,
      category: this.selectedCategory.categoryName
    });

    // Reset form
    this.newItem = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      calories: 0,
      protein: 0,
      image: '',
      vegetarian: false,
      popular: false,
      soldOut: false,
      category: ''
    };

    this.showForm = false;
  }

  deleteItem(id: number) {
    this.menuItems = this.menuItems.filter(item => item.id !== id);
  }

  toggleSoldOut(item: MenuItem) {
    item.soldOut = !item.soldOut;
  }

  editItem(item: MenuItem) {
    this.editingItem = { ...item };
  }

  saveEdit() {
    if (!this.editingItem) return;
    const index = this.menuItems.findIndex(i => i.id === this.editingItem!.id);
    if (index > -1) {
      this.menuItems[index] = this.editingItem;
    }
    this.editingItem = null;
  }

  cancelEdit() {
    this.editingItem = null;
  }

}