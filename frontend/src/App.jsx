import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AlertBanner from './components/AlertBanner';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api/productApi';

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const dismissAlert = () => {
    setAlert(null);
  };

  // Fetch products from Django REST API
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err);
      showAlert(
        `Unable to connect to Django API (${err.message || 'Network error'}). Ensure backend is running.`,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filter products by search term (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const term = searchQuery.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, searchQuery]);

  // Handle Create Product
  const handleCreateSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      const created = await createProduct(productData);
      setProducts((prev) => [created, ...prev]);
      showAlert(`Product "${created.name}" created successfully.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Product
  const handleUpdateSubmit = async (productData) => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const updated = await updateProduct(editingProduct.id, productData);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showAlert(`Product "${updated.name}" updated successfully.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteConfirm = async (productId) => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      const deletedName = deletingProduct?.name || 'Item';
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      setDeletingProduct(null);
      showAlert(`Product "${deletedName}" deleted successfully.`);
    } catch (err) {
      console.error('Delete failed:', err);
      showAlert(err.message || 'Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Inventory Dashboard</h2>
              <p className="text-sm text-slate-500 max-w-2xl">
                Real-time product stock, valuations, and catalog management powered by Django REST Framework.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                onClick={loadProducts}
                disabled={isLoading}
                title="Reload products from backend"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={isLoading ? 'animate-spin' : ''}
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormModalOpen(true);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Metric Statistics Cards */}
          <DashboardStats products={products} />

          {/* Table Controls (Search and Title) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-semibold text-slate-900">Products Catalog</h3>
              <span className="text-xs font-medium bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                {products.length} items
              </span>
            </div>
            <div className="relative w-full sm:w-80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="w-full text-sm pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Products Table */}
          <ProductTable
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            onAddClick={() => {
              setEditingProduct(null);
              setIsFormModalOpen(true);
            }}
            onEditClick={(prod) => {
              setEditingProduct(prod);
              setIsFormModalOpen(true);
            }}
            onDeleteClick={(prod) => {
              setDeletingProduct(prod);
            }}
            onClearSearch={() => setSearchQuery('')}
            onRetry={loadProducts}
          />
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        initialProduct={editingProduct}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateSubmit : handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Floating Toast Notification */}
      <AlertBanner alert={alert} onDismiss={dismissAlert} />
    </div>
  );
}
