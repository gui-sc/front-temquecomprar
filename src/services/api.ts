import { Product, ShoppingListItem, FamilyMember } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }

  async getShoppingList(): Promise<ShoppingListItem[]> {
    const response = await fetch(`${API_BASE_URL}/shopping-list`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch shopping list');
    }

    return response.json();
  }

  async addToShoppingList(item: Omit<ShoppingListItem, 'id' | 'addedAt'>): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE_URL}/shopping-list`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to add to shopping list');
    }

    return response.json();
  }

  async updateShoppingListItem(id: string, item: Partial<ShoppingListItem>): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error('Failed to update shopping list item');
    }

    return response.json();
  }

  async deleteShoppingListItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shopping-list/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete shopping list item');
    }
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    const response = await fetch(`${API_BASE_URL}/family/members`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }

    return response.json();
  }

  async generateInviteLink(): Promise<{ token: string; expiresAt: string }> {
    const response = await fetch(`${API_BASE_URL}/family/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to generate invite link');
    }

    return response.json();
  }

  async savePushToken(pushToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/token`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pushToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push token');
    }
  }
}

export const apiService = new ApiService();
