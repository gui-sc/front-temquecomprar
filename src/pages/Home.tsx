import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { products, shoppingList, familyMembers, loadProducts, loadShoppingList, loadFamilyData } = useStore();
  const [loading, setLoading] = useState(true);

  const lowStockCount = products.filter(p => p.quantidadeAtual <= p.quantidadeMinima).length;
  const pendingPurchases = shoppingList.filter(item => !item.comprado).length;

  useEffect(() => {
    if ('Notification' in globalThis && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Carregar dados iniciais
    Promise.all([
      loadProducts().catch(err => console.error('Erro ao carregar produtos:', err)),
      loadShoppingList().catch(err => console.error('Erro ao carregar lista:', err)),
      loadFamilyData().catch(err => console.error('Erro ao carregar família:', err)),
    ]).finally(() => setLoading(false));
  }, [loadProducts, loadShoppingList, loadFamilyData]);

  const cards = [
    {
      title: 'Produtos',
      icon: Package,
      count: products.length,
      color: 'from-blue-500 to-blue-600',
      path: '/products',
      description: 'produtos cadastrados',
    },
    {
      title: 'Lista de Compras',
      icon: ShoppingCart,
      count: pendingPurchases,
      color: 'from-green-500 to-green-600',
      path: '/shopping-list',
      description: 'itens pendentes',
    },
    {
      title: 'Membros',
      icon: Users,
      count: familyMembers.length,
      color: 'from-purple-500 to-purple-600',
      path: '/members',
      description: 'membros da família',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">Bem-vindo ao painel de controle</p>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-red-800">Atenção!</p>
                <p className="text-sm text-red-700">
                  {lowStockCount} {lowStockCount === 1 ? 'produto está' : 'produtos estão'} com estoque baixo
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{card.count}</span>
                  <span className="text-sm text-gray-600">{card.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
            >
              Adicionar Produto
            </button>
            <button
              onClick={() => navigate('/shopping-list')}
              className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
            >
              Ver Lista de Compras
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
