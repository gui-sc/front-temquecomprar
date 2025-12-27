import { Check, X } from 'lucide-react';
import { ShoppingListItem as ShoppingListItemType } from '../types';

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onTogglePurchased: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function ShoppingListItem({ item, onTogglePurchased, onRemove }: ShoppingListItemProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${item.comprado ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTogglePurchased(item.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                item.comprado
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {item.comprado && <Check size={16} className="text-white" />}
            </button>
            <div>
              <h3 className={`font-semibold text-gray-800 ${item.comprado ? 'line-through' : ''}`}>
                {item.produtoNome || 'Produto'}
              </h3>
              <p className="text-sm text-gray-600">{item.produtoMarca || ''}</p>
              <p className="text-xs text-gray-500 mt-1">Qtd: {item.quantidade}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
