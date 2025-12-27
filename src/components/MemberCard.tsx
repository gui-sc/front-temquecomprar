import { User } from 'lucide-react';
import { FamilyMember } from '../types';

interface MemberCardProps {
  member: FamilyMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{member.nome}</h3>
          </div>
          <p className="text-sm text-gray-600">{member.email}</p>
        </div>
      </div>
    </div>
  );
}
