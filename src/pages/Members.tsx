import { useState } from 'react';
import { Link2, Copy } from 'lucide-react';
import Layout from '../components/Layout';
import MemberCard from '../components/MemberCard';
import { useStore } from '../store/useStore';

export default function Members() {
  const { familyMembers } = useStore();
  const [showInviteLink, setShowInviteLink] = useState(false);

  const mockMembers = [
    { id: '1', name: 'João Silva', email: 'joao@familia.com', role: 'admin' as const, joinedAt: '2024-01-15' },
    { id: '2', name: 'Maria Silva', email: 'maria@familia.com', role: 'member' as const, joinedAt: '2024-01-15' },
    { id: '3', name: 'Pedro Silva', email: 'pedro@familia.com', role: 'member' as const, joinedAt: '2024-02-01' },
    { id: '4', name: 'Ana Silva', email: 'ana@familia.com', role: 'member' as const, joinedAt: '2024-02-10' },
  ];

  const inviteToken = 'abc123xyz789';
  const inviteLink = `${window.location.origin}/join/${inviteToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copiado para a área de transferência!');
  };

  const members = familyMembers.length > 0 ? familyMembers : mockMembers;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Membros da Família</h2>
            <p className="text-gray-600">{members.length} membros conectados</p>
          </div>
          <button
            onClick={() => setShowInviteLink(!showInviteLink)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Link2 size={20} />
            <span>Convidar</span>
          </button>
        </div>

        {showInviteLink && (
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
              Este link expira em 7 dias
            </p>
          </div>
        )}

        <div className="space-y-3">
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
