function formatPrice(num) {
  return new Intl.NumberFormat('vi-VN').format(num);
}

const IN_SUBFOLDER = window.location.pathname.includes('/html/');
const PATH_PRODUCTS = 'products.html';
const PATH_HOME = IN_SUBFOLDER ? '../index.html' : 'index.html';

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function updateHeaderCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.header-cart-count').forEach(el => {
    el.textContent = totalQty > 0 ? ` (${totalQty})` : '';
  });
}

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

window.addEventListener('storage', () => {
  updateHeaderCartCount();
  updateHeaderAuthState();
});

function getAccounts() {
  return JSON.parse(localStorage.getItem('accounts')) || [];
}

function saveAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}