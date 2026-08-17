/* ============================================================
   detail.js
   Trang Chi tiết sản phẩm:
   - Lấy ID sản phẩm từ query string (?id=...)
   - fetch() GET đúng sản phẩm đó từ json-server
   - Render toàn bộ thông tin theo ID nhận được
   - Điều khiển số lượng + Thêm vào giỏ hàng (LocalStorage)
   ============================================================ */

let currentProduct = null;
let currentQty = 1;

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderDetail(p) {
  document.title = `${p.name} - Chi tiết sản phẩm`;

  document.getElementById('detailMainImage').textContent = p.emoji;
  document.getElementById('detailTitle').textContent = p.name;

  const fullStars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
  document.getElementById('detailRating').innerHTML =
    `<span class="stars">${fullStars}</span> (${p.reviewCount} đánh giá) <span id="detailStock">| Còn ${p.stock} sản phẩm</span>`;

  document.getElementById('detailDescription').textContent = p.description;

  document.getElementById('detailPrice').textContent = `${formatPrice(p.price)} ₫`;
  const oldPriceEl = document.getElementById('detailOldPrice');
  const badgeEl = document.querySelector('#detailPriceWrapper .badge');
  if (p.oldPrice) {
    oldPriceEl.textContent = `${formatPrice(p.oldPrice)} ₫`;
    oldPriceEl.hidden = false;
    const discount = Math.round((1 - p.price / p.oldPrice) * 100);
    if (badgeEl) { badgeEl.textContent = `-${discount}%`; badgeEl.hidden = false; }
  } else {
    oldPriceEl.hidden = true;
    if (badgeEl) badgeEl.hidden = true;
  }

  const shippingRow = document.getElementById('detailShippingValue');
  if (shippingRow) shippingRow.textContent = p.freeShipping ? 'Có' : 'Không';
  const warrantyRow = document.getElementById('detailWarrantyValue');
  if (warrantyRow) warrantyRow.textContent = p.warranty;

  document.getElementById('detailSpecList').innerHTML =
    p.specs.map(s => `<li class="detail-spec-item">${s}</li>`).join('');

  if (p.review) {
    document.getElementById('detailReviewer').textContent = p.review.author;
    document.getElementById('detailReviewStars').textContent = '★'.repeat(p.review.stars) + '☆'.repeat(5 - p.review.stars);
    document.getElementById('detailReviewText').textContent = p.review.text;
    document.getElementById('detailReviewAvatar').textContent = p.review.author.charAt(0);
  }

  currentQty = 1;
  document.getElementById('detailQtyValue').textContent = currentQty;
}

function showDetailError(message) {
  const main = document.querySelector('main.container');
  if (main) {
    main.innerHTML = `<div class="box mt-20 text-center">
      <h2>${message}</h2>
      <p class="text-muted mt-20">Sản phẩm không tồn tại hoặc đã bị gỡ khỏi hệ thống.</p>
      <a href="products.html" class="header-btn" style="display:inline-block;margin-top:16px;">Quay lại danh sách sản phẩm</a>
    </div>`;
  }
}

function wireQtyControls() {
  const minusBtn = document.querySelectorAll('.detail-qty-btn')[0];
  const plusBtn = document.querySelectorAll('.detail-qty-btn')[1];
  const qtyValue = document.getElementById('detailQtyValue');

  if (minusBtn) minusBtn.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty -= 1;
      qtyValue.textContent = currentQty;
    }
  });

  if (plusBtn) plusBtn.addEventListener('click', () => {
    currentQty += 1;
    qtyValue.textContent = currentQty;
  });
}

function wireAddToCart() {
  const addBtn = document.getElementById('detailAddToCartBtn');
  const buyBtn = document.getElementById('detailBuyBtn');

  function addToCart() {
    if (!currentProduct) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === currentProduct.id);
    if (existing) {
      existing.qty += currentQty;
    } else {
      cart.push({ id: currentProduct.id, name: currentProduct.name, price: currentProduct.price, emoji: currentProduct.emoji, qty: currentQty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateHeaderCartCount();
  }

  if (addBtn) addBtn.addEventListener('click', () => {
    addToCart();
    const original = addBtn.textContent;
    addBtn.textContent = '✓ Đã thêm vào giỏ!';
    setTimeout(() => { addBtn.textContent = original; }, 1200);
  });

  if (buyBtn) buyBtn.addEventListener('click', () => {
    addToCart();
    window.location.href = 'cart.html';
  });
}

async function initDetailPage() {
  const titleEl = document.getElementById('detailTitle');
  if (!titleEl) return;

  const id = getProductIdFromURL();
  if (!id) {
    showDetailError('Thiếu mã sản phẩm');
    return;
  }

  try {
    const product = await fetchProductById(id);
    if (!product) {
      showDetailError('Không tìm thấy sản phẩm');
      return;
    }
    currentProduct = product;
    renderDetail(product);
    wireQtyControls();
    wireAddToCart();
  } catch (err) {
    showDetailError('Không thể tải sản phẩm');
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', initDetailPage);
