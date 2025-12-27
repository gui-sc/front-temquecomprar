import { create } from 'zustand';
import { User, Product, ShoppingListItem, FamilyMember } from '../types';
import { apiService } from '../services/api';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  products: Product[];
  shoppingList: ShoppingListItem[];
  familyMembers: FamilyMember[];
  pushToken: string | null;
  toasts: Toast[];

  setUser: (user: User | null) => void;
  setToken: (token: string | null, refreshToken?: string | null) => void;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (email: string, senha: string, nome: string, nomeFamilia?: string, conviteToken?: string) => Promise<boolean>;
  logout: () => void;

  loadProducts: () => Promise<void>;
  addProduct: (nome: string, marca: string, categoria: string, quantidadeAtual: number, quantidadeMinima: number) => Promise<void>;
  updateProduct: (id: number, updates: { nome?: string; marca?: string; categoria?: string; quantidadeAtual?: number; quantidadeMinima?: number }) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  loadShoppingList: () => Promise<void>;
  addToShoppingList: (produtoId: number, quantidade: number) => Promise<void>;
  togglePurchased: (id: number) => Promise<void>;
  removeFromShoppingList: (id: number) => Promise<void>;

  loadFamilyData: () => Promise<void>;
  generateInvite: () => Promise<{ token: string; expiresAt: string; link: string }>;

  setPushToken: (token: string) => Promise<void>;

  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: sessionStorage.getItem('token'),
  refreshToken: sessionStorage.getItem('refreshToken'),
  products: [],
  shoppingList: [],
  familyMembers: [],
  pushToken: null,
  toasts: [],

  setUser: (user) => set({ user }),

  setToken: (token, refreshToken) => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }

    if (refreshToken !== undefined) {
      if (refreshToken) {
        sessionStorage.setItem('refreshToken', refreshToken);
      } else {
        sessionStorage.removeItem('refreshToken');
      }
    }

    set({ token, ...(refreshToken !== undefined && { refreshToken }) });
  },

  login: async (email: string, senha: string) => {
    try {
      const data = await apiService.login({ email, senha });
      
      set({ 
        user: data.usuario, 
        token: data.token,
        refreshToken: data.refreshToken 
      });
      
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  },

  register: async (email: string, senha: string, nome: string, nomeFamilia?: string, conviteToken?: string) => {
    try {
      const data = await apiService.register({ 
        email, 
        senha, 
        nome, 
        nomeFamilia, 
        conviteToken 
      });
      
      set({ 
        user: data.usuario, 
        token: data.token,
        refreshToken: data.refreshToken 
      });
      
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    set({ 
      user: null, 
      token: null, 
      refreshToken: null,
      products: [], 
      shoppingList: [], 
      familyMembers: [] 
    });
  },

  loadProducts: async () => {
    try {
      const products = await apiService.getProducts();
      set({ products });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      throw error;
    }
  },

  addProduct: async (nome: string, marca: string, categoria: string, quantidadeAtual: number, quantidadeMinima: number) => {
    try {
      const newProduct = await apiService.createProduct({
        nome,
        marca,
        categoria,
        quantidadeAtual,
        quantidadeMinima,
      });
      
      set((state) => ({
        products: [...state.products, newProduct],
      }));
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, updates) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, updates);
      
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? updatedProduct : p
        ),
      }));
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await apiService.deleteProduct(id);
      
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  },

  loadShoppingList: async () => {
    try {
      const shoppingList = await apiService.getShoppingList();
      set({ shoppingList });
    } catch (error) {
      console.error('Erro ao carregar lista de compras:', error);
      throw error;
    }
  },

  addToShoppingList: async (produtoId: number, quantidade: number) => {
    try {
      const newItem = await apiService.addToShoppingList({ produtoId, quantidade });
      
      set((state) => ({
        shoppingList: [...state.shoppingList, newItem],
      }));
    } catch (error) {
      console.error('Erro ao adicionar item à lista:', error);
      throw error;
    }
  },

  togglePurchased: async (id: number) => {
    try {
      const updatedItem = await apiService.togglePurchased(id);
      
      set((state) => ({
        shoppingList: state.shoppingList.map((item) =>
          item.id === id ? updatedItem : item
        ),
      }));
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  },

  removeFromShoppingList: async (id: number) => {
    try {
      await apiService.deleteShoppingListItem(id);
      
      set((state) => ({
        shoppingList: state.shoppingList.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  },

  loadFamilyData: async () => {
    try {
      const familyData = await apiService.getFamily();
      set({ familyMembers: familyData.membros });
    } catch (error) {
      console.error('Erro ao carregar dados da família:', error);
      throw error;
    }
  },

  generateInvite: async () => {
    try {
      return await apiService.generateInviteToken();
    } catch (error) {
      console.error('Erro ao gerar convite:', error);
      throw error;
    }
  },

  setPushToken: async (pushToken: string) => {
    try {
      await apiService.savePushToken(pushToken);
      set({ pushToken });
    } catch (error) {
      console.error('Erro ao salvar token de push:', error);
      throw error;
    }
  },

  addToast: (type: Toast['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
