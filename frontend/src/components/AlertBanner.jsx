import React, { useEffect } from 'react';

export default function AlertBanner({ alert, onDismiss }) {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [alert, onDismiss]);

  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm z-50 max-w-md transition-all ${
        isSuccess
          ? 'bg-emerald-950 text-emerald-100 border border-emerald-800'
          : 'bg-rose-950 text-rose-100 border border-rose-800'
      }`}
      role="status"
    >
      <div className="shrink-0">
        {isSuccess ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <div className="flex-1 font-medium">{alert.message}</div>
      <button
        type="button"
        className="text-white/70 hover:text-white p-1 rounded-md text-xs transition"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
