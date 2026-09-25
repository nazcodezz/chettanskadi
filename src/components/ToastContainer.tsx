import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map(toast => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : toast.type === 'alert' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          );

        const borderBg =
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : toast.type === 'alert'
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : toast.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-white border-amber-200/80 text-stone-900';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg shadow-stone-900/5 transition-all animate-in fade-in slide-in-from-bottom-2 ${borderBg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              <p className="text-xs opacity-90 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
