/* ============================================================
   api.js
   Tất cả các lệnh gọi fetch() (GET) tới json-server được gom
   về một chỗ để dễ kiểm soát và dễ vấn đáp code.

   Cách chạy json-server:
     1) npm install -g json-server
     2) Đứng ở thư mục Products/ chạy: json-server --watch db.json --port 3000
     3) API sản phẩm sẽ có tại: http://localhost:3000/products
   ============================================================ */

const API_BASE_URL = 'http://localhost:3000';

/**
 * Lấy toàn bộ danh sách sản phẩm từ json-server (GET /products)
 * @returns {Promise<Array>} mảng sản phẩm
 */
async function fetchAllProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) {
    throw new Error('Không thể tải danh sách sản phẩm (HTTP ' + res.status + ')');
  }
  return res.json();
}

/**
 * Lấy đúng 1 sản phẩm theo ID (GET /products/:id)
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
