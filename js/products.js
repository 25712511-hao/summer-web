/* ============================================================
   products.js
   Trang Danh sách sản phẩm:
   - Gọi fetch() GET tới json-server để lấy danh sách sản phẩm
   - Render ra dạng card/grid
   - Lọc theo danh mục (?category=) và tìm kiếm (?search=) trên URL
   - Thêm vào giỏ hàng (lưu LocalStorage)
   ============================================================ */

let allProducts = [];

function productCardHTML(p) {
  const oldPriceHTML = p.oldPrice
    ? `<span class="product-old-price">${formatPrice(p.oldPrice)} ₫</span>`
    : '';
  const badgeHTML = p.badge
    ? `<div class="product-badge">${p.badge}</div>`
    : '';
  const fullStars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);

  return `
    <div class="box product-card" data-id="${p.id}" data-category="${p.category}">
      ${badgeHTML}
      <a href="detail.html?id=${encodeURIComponent(p.id)}" class="product-link">
        <div class="product-image">${p.emoji}</div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.shortDesc}</p>
        <div class="product-rating"><span class="stars">${fullStars}</span> (${p.reviewCount})</div>
        <p class="product-price">${formatPrice(p.price)} ₫ ${oldPriceHTML}</p>
      </a>
      <button class="add-to-cart" type="button">Thêm vào giỏ</button>
    </div>`;
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('productsEmpty');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  grid.innerHTML = list.map(productCardHTML).join('');
  wireAddToCartButtons(list);
}

function wireAddToCartButtons(list) {
  document.querySelectorAll('#productsGrid .add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const product = list.find(p => p.id === card.dataset.id);
      if (!product) return;
      addProductToCart(product, btn);
    });
  });
}

function addProductToCart(product, btn) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateHeaderCartCount();

  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = '✓ Đã thêm!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  }
}

function applyFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const search = (params.get('search') || '').trim().toLowerCase();

  let filtered = allProducts;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }

  // Đánh dấu danh mục đang chọn trên thanh nav
  document.querySelectorAll('.category-nav a').forEach(link => {
    link.classList.toggle('active', category && link.dataset.category === category);
  });

  const title = document.getElementById('productsPageTitle');
  if (title) {
    if (search) title.textContent = `Kết quả tìm kiếm cho "${search}"`;
    else if (category) title.textContent = 'Danh sách sản phẩm';
    else title.textContent = 'Danh sách sản phẩm';
  }

  renderProducts(filtered);
}

async function initProductsPage() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const loading = document.getElementById('productsLoading');
  const errorBox = document.getElementById('productsError');

  try {
    if (loading) loading.hidden = false;
    allProducts = await fetchAllProducts();
    if (loading) loading.hidden = true;
    applyFiltersFromURL();
  } catch (err) {
    if (loading) loading.hidden = true;
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = 'Không tải được sản phẩm. Hãy chắc chắn json-server đang chạy (json-server --watch db.json --port 3000).';
    }
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', initProductsPage);
