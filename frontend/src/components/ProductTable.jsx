import React from 'react';

/**
 * Format ISO datetime string into human readable date: e.g. "Oct 26, 2026, 10:45 AM"
 */
function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format currency value: e.g. "$120.00"
 */
function formatCurrency(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export default function ProductTable({
  products,
  isLoading,
  error,
  searchQuery,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onClearSearch,
  onRetry,
}) {
  // Loading skeleton state
  if (isLoading && products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading inventory from Django API...</p>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Failed to load inventory</h3>
        <p className="text-sm text-slate-500 max-w-md mb-5">{error.message || 'Could not connect to Django backend server.'}</p>
        <button
          type="button"
          className="inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          onClick={onRetry}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty state (no products in inventory)
  if (products.length === 0 && !searchQuery) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No products in inventory</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-5">
          Your inventory is currently empty. Add your first product to start tracking your stock and value.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          onClick={onAddClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add First Product
        </button>
      </div>
    );
  }

  // No search results state
  if (products.length === 0 && searchQuery) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No matching products</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-5">
          No products matched your search for <strong className="text-slate-800">&quot;{searchQuery}&quot;</strong>.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
          onClick={onClearSearch}
        >
          Clear Search Filter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th scope="col" className="w-16 px-4 py-3">ID</th>
              <th scope="col" className="px-4 py-3">Product Name</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Stock Quantity</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Created Date</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const qty = parseInt(product.quantity, 10);
              let statusClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              let statusLabel = 'In Stock';

              if (qty === 0) {
                statusClasses = 'bg-rose-50 text-rose-700 border-rose-200';
                statusLabel = 'Out of Stock';
              } else if (qty <= 5) {
                statusClasses = 'bg-amber-50 text-amber-700 border-amber-200';
                statusLabel = 'Low Stock';
              }

              return (
                <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">#{product.id}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{product.name}</td>
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-800">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-900">{qty}</span>
                    <span className="text-xs text-slate-400 ml-1">units</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusClasses}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatDate(product.created_at)}</td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                      onClick={() => onEditClick(product)}
                      title={`Edit ${product.name}`}
                      aria-label={`Edit ${product.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition ml-2 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                      onClick={() => onDeleteClick(product)}
                      title={`Delete ${product.name}`}
                      aria-label={`Delete ${product.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        Showing {products.length} {products.length === 1 ? 'product' : 'products'}
      </div>
    </div>
  );
}
