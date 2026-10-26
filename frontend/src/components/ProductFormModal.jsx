import React, { useState, useEffect } from 'react';

export default function ProductFormModal({
  isOpen,
  initialProduct,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const isEditMode = Boolean(initialProduct && initialProduct.id);

  // Synchronize form when opened or initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setPrice(initialProduct.price !== undefined ? String(initialProduct.price) : '');
      setQuantity(initialProduct.quantity !== undefined ? String(initialProduct.quantity) : '');
    } else {
      setName('');
      setPrice('');
      setQuantity('');
    }
    setErrors({});
    setApiError('');
  }, [initialProduct, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Validate form client-side before sending to API
  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Product name cannot exceed 100 characters.';
    }

    if (price === '' || price === null) {
      newErrors.price = 'Price is required.';
    } else {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice)) {
        newErrors.price = 'Price must be a valid number.';
      } else if (numPrice < 0) {
        newErrors.price = 'Price cannot be negative.';
      }
    }

    if (quantity === '' || quantity === null) {
      newErrors.quantity = 'Quantity is required.';
    } else {
      const numQty = parseInt(quantity, 10);
      if (isNaN(numQty) || !/^-?\d+$/.test(String(quantity).trim())) {
        newErrors.quantity = 'Quantity must be a whole number.';
      } else if (numQty < 0) {
        newErrors.quantity = 'Quantity cannot be negative.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        price: parseFloat(price).toFixed(2),
        quantity: parseInt(quantity, 10),
      });
      onClose();
    } catch (err) {
      if (err.fieldErrors && typeof err.fieldErrors === 'object') {
        const mappedErrors = {};
        for (const [key, val] of Object.entries(err.fieldErrors)) {
          mappedErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        }
        setErrors(mappedErrors);
      }
      setApiError(err.message || 'An error occurred while saving the product.');
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update product details in your Django inventory.'
                : 'Create and save a new inventory item to the database.'}
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-lg mb-5" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="product-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              className={`w-full text-sm px-3.5 py-2 rounded-lg border transition focus:outline-hidden focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              placeholder="e.g. Wireless Ergonomic Mouse"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && <span className="block text-xs text-rose-600 mt-1">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="product-price" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit Price (USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-medium text-slate-400 pointer-events-none">$</span>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full text-sm pl-7 pr-3.5 py-2 rounded-lg border transition focus:outline-hidden focus:ring-2 ${
                    errors.price
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                  }}
                  disabled={isSubmitting}
                />
              </div>
              {errors.price && <span className="block text-xs text-rose-600 mt-1">{errors.price}</span>}
            </div>

            <div>
              <label htmlFor="product-quantity" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity in Stock <span className="text-rose-500">*</span>
              </label>
              <input
                id="product-quantity"
                type="number"
                step="1"
                min="0"
                className={`w-full text-sm px-3.5 py-2 rounded-lg border transition focus:outline-hidden focus:ring-2 ${
                  errors.quantity
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="0"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }));
                }}
                disabled={isSubmitting}
              />
              {errors.quantity && <span className="block text-xs text-rose-600 mt-1">{errors.quantity}</span>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              className="text-xs font-medium px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
