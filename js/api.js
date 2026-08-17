const API_BASE_URL = 'http://localhost:3000';

/**
 @returns {Promise<Array>}
 */
async function fetchAllProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) {
    throw new Error('Không thể tải danh sách sản phẩm (HTTP ' + res.status + ')');
  }
  return res.json();
}

/**
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function fetchProductById(id) {
  const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error('Không thể tải sản phẩm (HTTP ' + res.status + ')');
  }
  return res.json();
}
