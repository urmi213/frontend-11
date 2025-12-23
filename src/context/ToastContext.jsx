import React, { createContext, useContext, useState } from 'react';

// ToastContext তৈরি করুন
const ToastContext = createContext();

// Custom hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              toast.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : toast.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : toast.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && (
                <span className="text-green-600">✓</span>
              )}
              {toast.type === 'error' && (
                <span className="text-red-600">✗</span>
              )}
              {toast.type === 'warning' && (
                <span className="text-yellow-600">⚠</span>
              )}
              {toast.type === 'info' && (
                <span className="text-blue-600">ℹ</span>
              )}
              <span className="font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Default export
export default ToastContext;