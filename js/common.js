/* ============================================================
   common.js
   Logic dùng chung cho MỌI trang: header, thanh danh mục,
   ô tìm kiếm, số lượng giỏ hàng trên header, trạng thái đăng nhập.
   ============================================================ */

function formatPrice(num) {
  return new Intl.NumberFormat('vi-VN').format(num);
}

// Trang con nằm trong /html/ nên cần biết đường dẫn về trang chủ & giữa các trang
const IN_SUBFOLDER = window.location.pathname.includes('/html/');
const PATH_PRODUCTS = 'products.html';
const PATH_HOME = IN_SUBFOLDER ? '../index.html' : 'index.html';

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

/* ---------- Số lượng giỏ hàng hiển thị trên header ---------- */
function updateHeaderCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.header-cart-count').forEach(el => {
    el.textContent = totalQty > 0 ? ` (${totalQty})` : '';
  });
}

/* ---------- Đổi nút Login -> tên người dùng nếu đã đăng nhập ---------- */
function updateHeaderAuthState() {
  const user = getCurrentUser();
  document.querySelectorAll('.header-login-link').forEach(el => {
    if (user) {
      el.textContent = `👤 ${user.fullName || user.email}`;
      el.href = IN_SUBFOLDER ? 'profile.html' : 'html/profile.html';
    } else {
      el.textContent = 'Login';
      el.href = IN_SUBFOLDER ? 'login.html' : 'html/login.html';
    }
  });
}

/* ---------- Thanh danh mục: điều hướng sang trang Products kèm bộ lọc ---------- */
function wireCategoryNav() {
  document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      const target = IN_SUBFOLDER ? PATH_PRODUCTS : `html/${PATH_PRODUCTS}`;
      window.location.href = `${target}?category=${encodeURIComponent(category)}`;
    });
  });
}

/* ---------- Ô tìm kiếm trên header: gõ Enter hoặc bấm icon để tìm ---------- */
function wireHeaderSearch() {
  document.querySelectorAll('.header-search').forEach(box => {
    const input = box.querySelector('input');
    const button = box.querySelector('.search-button');
    if (!input) return;

    const doSearch = () => {
      const keyword = input.value.trim();
      const target = IN_SUBFOLDER ? PATH_PRODUCTS : `html/${PATH_PRODUCTS}`;
      window.location.href = `${target}${keyword ? '?search=' + encodeURIComponent(keyword) : ''}`;
    };

    if (button) button.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wireCategoryNav();
  wireHeaderSearch();
  updateHeaderCartCount();
  updateHeaderAuthState();
});

// Đồng bộ số lượng giỏ hàng nếu người dùng mở nhiều tab
window.addEventListener('storage', () => {
  updateHeaderCartCount();
  updateHeaderAuthState();
});
