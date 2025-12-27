import { useState, useMemo, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import CategorySelect from '../components/CategorySelect';
import { useStore } from '../store/useStore';
import { Product } from '../types';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, addToShoppingList, loadProducts, addToast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    currentQuantity: 0,
    minQuantity: 1,
  });

  useEffect(() => {
    loadProducts()
      .catch(err => console.error('Erro ao carregar produtos:', err))
      .finally(() => setLoading(false));
  }, [loadProducts]);

  // Extrai categorias únicas dos produtos
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.categoria))).sort();
    setAllCategories(uniqueCategories);
  }, [products]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.categoria));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.marca.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          nome: formData.name,
          marca: formData.brand,
          categoria: formData.category,
          quantidadeAtual: formData.currentQuantity,
          quantidadeMinima: formData.minQuantity,
        });
        addToast('success', 'Produto atualizado com sucesso!');
      } else {
        await addProduct(
          formData.name,
          formData.brand,
          formData.category,
          formData.currentQuantity,
          formData.minQuantity
        );
        addToast('success', 'Produto cadastrado com sucesso!');
      }
      handleCloseModal();
    } catch (error) {
      addToast('error', 'Erro ao salvar produto. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.nome,
      brand: product.marca,
      category: product.categoria,
      currentQuantity: product.quantidadeAtual,
      minQuantity: product.quantidadeMinima,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      try {
        await deleteProduct(id);
        addToast('success', 'Produto excluído com sucesso!');
      } catch (error) {
        addToast('error', 'Erro ao excluir produto. Tente novamente.');
        console.error('Erro:', error);
      }
    }
  };

  const handleAddToList = async (product: Product) => {
    const quantityNeeded = product.quantidadeMinima - product.quantidadeAtual;
    try {
      await addToShoppingList(
        product.id,
        Math.max(1, quantityNeeded)
      );
      addToast('success', `${product.nome} adicionado à lista de compras!`);
    } catch (error) {
      addToast('error', 'Erro ao adicionar à lista. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: '',
      currentQuantity: 0,
      minQuantity: 1,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
            <p className="text-gray-600">{products.length} produtos cadastrados</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            <span>Adicionar</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <CategorySelect
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  categories={allCategories}
                  placeholder="Selecione ou crie uma categoria..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Atual</label>
                  <input
                    type="number"
                    value={formData.currentQuantity}
                    onChange={(e) => setFormData({ ...formData, currentQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Mínima</label>
                  <input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingProduct ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
