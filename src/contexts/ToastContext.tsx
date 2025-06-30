import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from '../components/ui/Toast';
import { ErrorCategory, getUserFriendlyError } from '../utils/ErrorUtils';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showError: (category: ErrorCategory, errorType: string, duration?: number) => void;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Show a toast message
  const showToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    
    // Auto-remove after duration
    setTimeout(() => {
      hideToast(id);
    }, duration);
    
    return id;
  };
  
  // Show a generic error message from our error utility
  const showError = (category: ErrorCategory, errorType: string, duration = 5000) => {
    const message = getUserFriendlyError(category, errorType);
    return showToast(message, 'error', duration);
  };

  // Hide a toast by id
  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showError, hideToast }}>
      {children}
      
      {/* Toast container - renders all active toasts */}
      <div className="toast-container fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
