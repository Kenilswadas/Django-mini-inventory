/**
 * API service module for communicating with the Django REST Framework backend.
 * Uses the Fetch API and environment-driven base URL.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api');

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
      // Extract first error message for high-level alert
      const messages = Object.entries(data)
        .map(([field, errs]) => {
          const text = Array.isArray(errs) ? errs.join(' ') : String(errs);
          return `${field}: ${text}`;
        });
      if (messages.length > 0) {
        errorMessage = messages.join(' | ');
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
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
  const url = `${API_BASE_URL}/products/${query}`;
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
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
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

  const response = await fetch(`${API_BASE_URL}/products/`, {
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

  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
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
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}
