import { create } from 'zustand';
import { User, Product, ShoppingListItem, FamilyMember } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  products: Product[];
  shoppingList: ShoppingListItem[];
  familyMembers: FamilyMember[];
  pushToken: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  setShoppingList: (items: ShoppingListItem[]) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => void;
  togglePurchased: (id: string) => void;
  removeFromShoppingList: (id: string) => void;

  setFamilyMembers: (members: FamilyMember[]) => void;

  setPushToken: (token: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: sessionStorage.getItem('token'),
  products: [],
  shoppingList: [],
  familyMembers: [],
  pushToken: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
    set({ token });
  },

  login: async (email: string, password: string) => {
    try {
      if (email === 'demo@familia.com' && password === 'demo123') {
        const user = {
          id: '1',
          name: 'João Silva',
          email: 'demo@familia.com',
        };
        const token = 'mock-token-' + Date.now();

        set({ user, token });
        sessionStorage.setItem('token', token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    set({ user: null, token: null, products: [], shoppingList: [], familyMembers: [] });
  },

  setProducts: (products) => set({ products }),

  addProduct: (product) => set((state) => ({
    products: [
      ...state.products,
      {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      },
    ],
  })),

  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...updatedProduct } : p
    ),
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),

  setShoppingList: (items) => set({ shoppingList: items }),

  addToShoppingList: (item) => set((state) => ({
    shoppingList: [
      ...state.shoppingList,
      {
        ...item,
        id: Date.now().toString(),
        addedAt: new Date().toISOString(),
      },
    ],
  })),

  togglePurchased: (id) => set((state) => ({
    shoppingList: state.shoppingList.map((item) =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ),
  })),

  removeFromShoppingList: (id) => set((state) => ({
    shoppingList: state.shoppingList.filter((item) => item.id !== id),
  })),

  setFamilyMembers: (members) => set({ familyMembers: members }),

  setPushToken: (pushToken) => set({ pushToken }),
}));
