export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  currentQuantity: number;
  minQuantity: number;
  addedBy: string;
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  purchased: boolean;
  addedBy: string;
  addedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface InviteLink {
  token: string;
  expiresAt: string;
}
