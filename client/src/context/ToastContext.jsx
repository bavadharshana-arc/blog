import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );
  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );
  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
