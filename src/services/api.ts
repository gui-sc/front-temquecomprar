import {
  ApiResponse,
  AuthData,
  Product,
  ShoppingListItem,
  FamilyData,
  LoginPayload,
  RegisterPayload,
  CreateProductPayload,
  UpdateProductPayload,
  CreateShoppingListPayload,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // ========== AUTENTICAÇÃO ==========

  async login(payload: LoginPayload): Promise<AuthData> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha no login');
    }

    const result: ApiResponse<AuthData> = await response.json();
    return result.data!;
  }

  async register(payload: RegisterPayload): Promise<AuthData> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha no registro');
    }

    const result: ApiResponse<AuthData> = await response.json();
    return result.data!;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar token');
    }

    const result: ApiResponse<{ token: string }> = await response.json();
    return result.data!.token;
  }

  // ========== FAMÍLIA ==========

  async getFamily(): Promise<FamilyData> {
    const response = await fetch(`${API_BASE_URL}/familia`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar dados da família');
    }

    const result: ApiResponse<FamilyData> = await response.json();
    return result.data!;
  }

  async generateInviteToken(): Promise<{ token: string; expiresAt: string; link: string }> {
    const response = await fetch(`${API_BASE_URL}/familia/convite`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao gerar convite');
    }

    const result: ApiResponse<{ token: string; expiresAt: string; link: string }> = await response.json();
    return result.data!;
  }

  // ========== CONVITES ==========

  async validateInviteToken(token: string): Promise<{ familia: { id: number; nome: string } }> {
    const response = await fetch(`${API_BASE_URL}/convite/${token}/validar`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Convite inválido ou expirado');
    }

    const result: ApiResponse<{ familia: { id: number; nome: string } }> = await response.json();
    return result.data!;
  }

  async acceptInvite(token: string, nome: string, email: string, senha: string): Promise<AuthData> {
    const response = await fetch(`${API_BASE_URL}/convite/${token}/aceitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao aceitar convite');
    }

    const result: ApiResponse<AuthData> = await response.json();
    return result.data!;
  }

  // ========== PRODUTOS ==========

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    const result: ApiResponse<Product[]> = await response.json();
    return result.data!;
  }

  async getAlertProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/produtos/alerta`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar produtos em alerta');
    }

    const result: ApiResponse<Product[]> = await response.json();
    return result.data!;
  }

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao criar produto');
    }

    const result: ApiResponse<Product> = await response.json();
    return result.data!;
  }

  async updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao atualizar produto');
    }

    const result: ApiResponse<Product> = await response.json();
    return result.data!;
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao excluir produto');
    }
  }

  // ========== CATEGORIAS ==========

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar categorias');
    }

    const result: ApiResponse<string[]> = await response.json();
    return result.data!;
  }

  // ========== LISTA DE COMPRAS ==========

  async getShoppingList(): Promise<ShoppingListItem[]> {
    const response = await fetch(`${API_BASE_URL}/compras`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar lista de compras');
    }

    const result: ApiResponse<ShoppingListItem[]> = await response.json();
    return result.data!;
  }

  async addToShoppingList(payload: CreateShoppingListPayload): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE_URL}/compras`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao adicionar item');
    }

    const result: ApiResponse<ShoppingListItem> = await response.json();
    return result.data!;
  }

  async togglePurchased(id: number): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE_URL}/compras/${id}/comprado`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao atualizar item');
    }

    const result: ApiResponse<ShoppingListItem> = await response.json();
    return result.data!;
  }

  async deleteShoppingListItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/compras/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.message || 'Falha ao remover item');
    }
  }

  // ========== NOTIFICAÇÕES ==========

  async savePushToken(pushToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/usuarios/token-push`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pushToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar token de push');
    }
  }
}

export const apiService = new ApiService();
