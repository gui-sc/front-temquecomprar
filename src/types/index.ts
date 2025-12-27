// Resposta da API com formato padrão
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Usuário autenticado
export interface User {
  id: number;
  nome: string;
  email: string;
  familiaId: number;
}

// Dados de autenticação
export interface AuthData {
  token: string;
  refreshToken: string;
  usuario: User;
}

// Produto do estoque
export interface Product {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  familiaId: number;
  createdAt: string;
  updatedAt: string;
}

// Item da lista de compras
export interface ShoppingListItem {
  id: number;
  produtoId: number;
  quantidade: number;
  adicionadoPor: number;
  comprado: boolean;
  familiaId: number;
  createdAt: string;
  updatedAt: string;
  produtoNome?: string;
  produtoMarca?: string;
  adicionadoPorNome?: string;
}

// Membro da família
export interface FamilyMember {
  id: number;
  nome: string;
  email: string;
}

// Convite pendente
export interface InviteToken {
  token: string;
  expiresAt: string;
  createdAt: string;
}

// Dados da família
export interface FamilyData {
  familia: {
    id: number;
    nome: string;
  };
  membros: FamilyMember[];
  convitesPendentes: InviteToken[];
}

// Payload de criação de produto
export interface CreateProductPayload {
  nome: string;
  marca: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
}

// Payload de atualização de produto
export interface UpdateProductPayload {
  nome?: string;
  marca?: string;
  categoria?: string;
  quantidadeAtual?: number;
  quantidadeMinima?: number;
}

// Payload de login
export interface LoginPayload {
  email: string;
  senha: string;
}

// Payload de registro
export interface RegisterPayload {
  email: string;
  senha: string;
  nome: string;
  nomeFamilia?: string;
  conviteToken?: string;
}

// Payload de item da lista de compras
export interface CreateShoppingListPayload {
  produtoId: number;
  quantidade: number;
}
