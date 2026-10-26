import React from 'react';

export default function DashboardStats({ products }) {
  // Compute statistics strictly from real API data
  const totalProducts = products.length;

  const totalUnits = products.reduce((sum, p) => {
    const qty = parseInt(p.quantity, 10);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);

  const totalValue = products.reduce((sum, p) => {
    const qty = parseInt(p.quantity, 10);
    const price = parseFloat(p.price);
    if (isNaN(qty) || isNaN(price)) return sum;
    return sum + (price * qty);
  }, 0);

  const outOfStockCount = products.filter((p) => {
    const qty = parseInt(p.quantity, 10);
    return !isNaN(qty) && qty === 0;
  }).length;

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalValue);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Inventory Overview Metrics">
      {/* Metric 1: Total Products */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Products</span>
          <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mb-1">{totalProducts}</div>
        <div className="text-xs text-slate-400">Unique items cataloged</div>
      </div>

      {/* Metric 2: Total Units in Stock */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Units in Stock</span>
          <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mb-1">{totalUnits.toLocaleString()}</div>
        <div className="text-xs text-slate-400">Individual items on hand</div>
      </div>

      {/* Metric 3: Total Inventory Value */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Inventory Value</span>
          <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mb-1">{formattedValue}</div>
        <div className="text-xs text-slate-400">Calculated as (Price × Qty)</div>
      </div>

      {/* Metric 4: Out of Stock */}
      <div className={`bg-white border rounded-lg p-5 shadow-xs hover:shadow-sm transition ${
        outOfStockCount > 0 ? 'border-amber-300 border-l-4 border-l-amber-500' : 'border-slate-200 hover:border-slate-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Out of Stock</span>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
            outOfStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 leading-tight mb-1">{outOfStockCount}</div>
        <div className="text-xs text-slate-400">
          {outOfStockCount > 0 ? 'Requires immediate restock' : 'All items in stock'}
        </div>
      </div>
    </div>
  );
}
