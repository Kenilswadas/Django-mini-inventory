/**
 * API service module for communicating with the Django REST Framework backend.
 * Uses the Fetch API and environment-driven base URL with intelligent normalization.
 */

/**
 * Normalizes the backend API base URL from environment or defaults.
 * Automatically handles:
 * - Missing /api (e.g. user entered https://example.onrender.com)
 * - Trailing slashes (e.g. https://example.onrender.com/ or https://example.onrender.com/api/)
 * - Accidental /products path (e.g. https://example.onrender.com/api/products)
 */
export function getBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || '').trim();

  if (!url) {
    // In production without an explicit VITE_API_BASE_URL, default to relative '/api'
    return import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api';
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip trailing /products or /products/ if user entered it
  if (url.endsWith('/products')) {
    url = url.substring(0, url.length - '/products'.length).replace(/\/+$/, '');
  }

  // Ensure /api suffix exists
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
}

/**
 * Helper to parse response and throw formatted errors for non-2xx responses.
 */
async function handleResponse(response) {
  if (response.status === 204) {
    // 204 No Content has no body
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let fieldErrors = null;

    if (isJson && typeof data === 'object') {
      fieldErrors = data;
      // Extract field errors for high-level alert
      const messages = Object.entries(data).map(([field, errs]) => {
        const text = Array.isArray(errs) ? errs.join(' ') : String(errs);
        return `${field}: ${text}`;
      });
      if (messages.length > 0) {
        errorMessage = messages.join(' | ');
      }
    } else if (typeof data === 'string' && data.length > 0) {
      // If the response is HTML (e.g. 404 or 500 error page), avoid dumping raw HTML into UI alert
      if (data.includes('<!doctype') || data.includes('<html') || data.includes('<body')) {
        errorMessage = `HTTP ${response.status} (${response.statusText || 'Not Found'}). Check backend API route.`;
      } else {
        errorMessage = data;
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.fieldErrors = fieldErrors;
    throw error;
  }

  return data;
}

/**
 * Fetch all products, optionally filtered by a search query.
 * @param {string} search - Optional search string matching product name
 */
export async function getProducts(search = '') {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  const url = `${getBaseUrl()}/products/${query}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * Retrieve a single product by its primary key ID.
 * @param {number|string} id
 */
export async function getProductById(id) {
  const response = await fetch(`${getBaseUrl()}/products/${id}/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * Create a new product.
 * @param {{ name: string, price: number|string, quantity: number|string }} productData
 */
export async function createProduct(productData) {
  const payload = {
    name: productData.name.trim(),
    price: parseFloat(productData.price).toFixed(2),
    quantity: parseInt(productData.quantity, 10),
  };

  const response = await fetch(`${getBaseUrl()}/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

/**
 * Update an existing product (full update).
 * @param {number|string} id
 * @param {{ name: string, price: number|string, quantity: number|string }} productData
 */
export async function updateProduct(id, productData) {
  const payload = {
    name: productData.name.trim(),
    price: parseFloat(productData.price).toFixed(2),
    quantity: parseInt(productData.quantity, 10),
  };

  const response = await fetch(`${getBaseUrl()}/products/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

/**
 * Delete a product by ID.
 * @param {number|string} id
 */
export async function deleteProduct(id) {
  const response = await fetch(`${getBaseUrl()}/products/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}
