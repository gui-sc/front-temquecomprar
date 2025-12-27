import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export default function Toast({ id, type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="animate-slide-in-right flex items-center gap-3 bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]">
      <div className={`${colors[type]} text-white p-2 rounded-lg`}>
        {icons[type]}
      </div>
      <p className="flex-1 text-gray-800 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
}
