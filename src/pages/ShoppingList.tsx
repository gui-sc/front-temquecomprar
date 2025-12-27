import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Layout from '../components/Layout';
import ShoppingListItem from '../components/ShoppingListItem';
import { useStore } from '../store/useStore';

export default function ShoppingList() {
  const { shoppingList, addToShoppingList, togglePurchased, removeFromShoppingList, user } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    quantity: 1,
  });

  const pendingItems = shoppingList.filter(item => !item.purchased);
  const purchasedItems = shoppingList.filter(item => item.purchased);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToShoppingList({
      productId: '',
      productName: formData.productName,
      brand: formData.brand,
      quantity: formData.quantity,
      purchased: false,
      addedBy: user?.name || 'Usuário',
    });
    setFormData({ productName: '', brand: '', quantity: 1 });
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
            <p className="text-gray-600">
              {pendingItems.length} {pendingItems.length === 1 ? 'item pendente' : 'itens pendentes'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} />
            <span>Adicionar</span>
          </button>
        </div>

        {shoppingList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Sua lista está vazia</p>
            <p className="text-sm text-gray-400 mt-2">Adicione produtos para começar</p>
          </div>
        ) : (
          <>
            {pendingItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Pendentes</h3>
                {pendingItems.map(item => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onTogglePurchased={togglePurchased}
                    onRemove={removeFromShoppingList}
                  />
                ))}
              </div>
            )}

            {purchasedItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Comprados</h3>
                {purchasedItems.map(item => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onTogglePurchased={togglePurchased}
                    onRemove={removeFromShoppingList}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Adicionar Item</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
