import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const colorScheme = colors[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${colorScheme.bg} p-3 rounded-full flex-shrink-0`}>
              <AlertCircle size={24} className={colorScheme.icon} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${colorScheme.button} text-white rounded-lg font-medium transition shadow-md`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
