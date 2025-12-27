import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Arroz',
    brand: 'Tio João',
    category: 'Alimentos',
    currentQuantity: 2,
    minQuantity: 3,
    addedBy: 'João Silva',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Feijão',
    brand: 'Camil',
    category: 'Alimentos',
    currentQuantity: 1,
    minQuantity: 2,
    addedBy: 'João Silva',
    createdAt: '2024-01-15T10:05:00Z',
  },
  {
    id: '3',
    name: 'Detergente',
    brand: 'Ypê',
    category: 'Limpeza',
    currentQuantity: 5,
    minQuantity: 3,
    addedBy: 'Maria Silva',
    createdAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '4',
    name: 'Sabonete',
    brand: 'Dove',
    category: 'Higiene',
    currentQuantity: 1,
    minQuantity: 4,
    addedBy: 'Maria Silva',
    createdAt: '2024-01-17T09:30:00Z',
  },
  {
    id: '5',
    name: 'Papel Higiênico',
    brand: 'Neve',
    category: 'Higiene',
    currentQuantity: 8,
    minQuantity: 6,
    addedBy: 'João Silva',
    createdAt: '2024-01-18T11:15:00Z',
  },
  {
    id: '6',
    name: 'Leite',
    brand: 'Parmalat',
    category: 'Alimentos',
    currentQuantity: 0,
    minQuantity: 6,
    addedBy: 'Pedro Silva',
    createdAt: '2024-01-19T08:45:00Z',
  },
];

export function loadMockData() {
  return mockProducts;
}
