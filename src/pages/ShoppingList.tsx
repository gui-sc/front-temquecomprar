import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Layout from '../components/Layout';
import ShoppingListItem from '../components/ShoppingListItem';
import ConfirmModal from '../components/ConfirmModal';
import { useStore } from '../store/useStore';

export default function ShoppingList() {
  const { 
    shoppingList, 
    products,
    addToShoppingList, 
    togglePurchased, 
    removeFromShoppingList,
    loadShoppingList,
    loadProducts,
    addToast
  } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    produtoId: 0,
    quantidade: 1,
  });

  useEffect(() => {
    Promise.all([
      loadShoppingList().catch(err => console.error('Erro ao carregar lista:', err)),
      loadProducts().catch(err => console.error('Erro ao carregar produtos:', err)),
    ]).finally(() => setLoading(false));
  }, [loadShoppingList, loadProducts]);

  const pendingItems = shoppingList.filter(item => !item.comprado);
  const purchasedItems = shoppingList.filter(item => item.comprado);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addToShoppingList(formData.produtoId, formData.quantidade);
      const product = products.find(p => p.id === formData.produtoId);
      addToast('success', `${product?.nome || 'Item'} adicionado à lista!`);
      setFormData({ produtoId: 0, quantidade: 1 });
      setShowModal(false);
    } catch (error) {
      addToast('error', 'Erro ao adicionar item. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await togglePurchased(id);
      const item = shoppingList.find(i => i.id === id);
      if (item) {
        addToast('success', item.comprado ? `${item.produtoNome} marcado como pendente` : `${item.produtoNome} marcado como comprado!`);
      }
    } catch (error) {
      addToast('error', 'Erro ao atualizar item. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  const handleRemove = async (id: number) => {
    const item = shoppingList.find(i => i.id === id);
    
    // Se o item já está comprado, remove diretamente sem confirmação
    if (item?.comprado) {
      try {
        await removeFromShoppingList(id);
        addToast('success', `${item.produtoNome || 'Item'} removido da lista!`);
      } catch (error) {
        addToast('error', 'Erro ao remover item. Tente novamente.');
        console.error('Erro:', error);
      }
    } else {
      // Se não está comprado, mostra modal de confirmação
      setItemToRemove(id);
      setShowConfirmModal(true);
    }
  };

  const confirmRemove = async () => {
    if (itemToRemove === null) return;
    
    try {
      const item = shoppingList.find(i => i.id === itemToRemove);
      await removeFromShoppingList(itemToRemove);
      addToast('success', `${item?.produtoNome || 'Item'} removido da lista!`);
    } catch (error) {
      addToast('error', 'Erro ao remover item. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando lista...</p>
        </div>
      </Layout>
    );
  }

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
                    onTogglePurchased={handleToggle}
                    onRemove={handleRemove}
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
                    onTogglePurchased={handleToggle}
                    onRemove={handleRemove}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select
                  value={formData.produtoId}
                  onChange={(e) => setFormData({ ...formData, produtoId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value={0}>Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.nome} - {product.marca}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
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

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Remover item da lista?"
        message={`Tem certeza que deseja remover "${shoppingList.find(i => i.id === itemToRemove)?.produtoNome || 'este item'}" da lista de compras? Esta ação não pode ser desfeita.`}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        type="danger"
      />
    </Layout>
  );
}
