import { AlertCircle, Edit2, Trash2, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddToList: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onAddToList }: ProductCardProps) {
  const isLowStock = product.quantidadeAtual <= product.quantidadeMinima;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isLowStock ? 'border-2 border-red-400' : ''}`}>
      {isLowStock && (
        <div className="flex items-center gap-2 mb-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span className="font-medium">Estoque baixo!</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{product.nome}</h3>
          <p className="text-sm text-gray-600">{product.marca}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {product.categoria}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">
          <span className="text-gray-600">Estoque: </span>
          <span className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
            {product.quantidadeAtual}
          </span>
          <span className="text-gray-500"> / min: {product.quantidadeMinima}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAddToList(product)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
        >
          <Plus size={16} />
          <span>Lista</span>
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
