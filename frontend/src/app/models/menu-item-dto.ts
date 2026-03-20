export interface MenuItemDto {
  menuItemId?: number;
  vendorId: number;
  categoryId: number;
  itemName: string;
  itemDescription?: string;
  price: number;
  calories?: number;
  isAvailable: boolean;
  createdAt?: Date;
  imageUrl?: string; // <-- add this property
}