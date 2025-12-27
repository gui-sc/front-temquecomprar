import { useState, useEffect } from 'react';
import { Link2, Copy } from 'lucide-react';
import Layout from '../components/Layout';
import MemberCard from '../components/MemberCard';
import { useStore } from '../store/useStore';

export default function Members() {
  const { familyMembers, loadFamilyData, generateInvite, addToast } = useStore();
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingInvite, setGeneratingInvite] = useState(false);

  useEffect(() => {
    loadFamilyData()
      .catch(err => console.error('Erro ao carregar membros:', err))
      .finally(() => setLoading(false));
  }, [loadFamilyData]);

  const handleGenerateInvite = async () => {
    setGeneratingInvite(true);
    try {
      const invite = await generateInvite();
      setInviteLink(invite.link);
      setExpiresAt(invite.expiresAt);
      setShowInviteLink(true);
      addToast('success', 'Link de convite gerado com sucesso!');
    } catch (error) {
      addToast('error', 'Erro ao gerar convite. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setGeneratingInvite(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    addToast('success', 'Link copiado para a área de transferência!');
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    return `${diffHours} horas`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando membros...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Membros da Família</h2>
            <p className="text-gray-600">{familyMembers.length} membros conectados</p>
          </div>
          <button
            onClick={handleGenerateInvite}
            disabled={generatingInvite}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            <Link2 size={20} />
            <span>{generatingInvite ? 'Gerando...' : 'Convidar'}</span>
          </button>
        </div>

        {showInviteLink && inviteLink && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Link de Convite</h3>
            <p className="text-sm text-gray-600 mb-4">
              Compartilhe este link com seus familiares para que eles possam se juntar à sua lista de compras
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Copy size={18} />
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Este link expira em {expiresAt && formatExpiryDate(expiresAt)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {familyMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
