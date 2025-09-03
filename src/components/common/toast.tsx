import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps extends Toast {
  onClose: (id: string) => void;
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 200);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-gray-700" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-gray-700" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-gray-700" />;
      case 'info':
        return <Info className="w-4 h-4 text-gray-700" />;
      default:
        return <Info className="w-4 h-4 text-gray-700" />;
    }
  };

  return (
    <div
      className={`
        relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-2 max-w-sm w-full backdrop-blur-sm overflow-hidden
        transform transition-all duration-200 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-medium text-black leading-tight">
            {title}
          </p>
          {message && (
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-md transition-colors duration-150 -mt-1 -mr-1"
        >
          <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <div 
          className="h-full bg-gray-800 transition-all ease-linear"
          style={{
            animation: `toast-progress ${duration}ms linear forwards`
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
