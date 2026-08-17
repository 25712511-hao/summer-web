/* ============================================================
   cart.js
   Trang Giỏ hàng: đọc/ghi dữ liệu giỏ hàng từ LocalStorage,
   tăng/giảm số lượng, xóa sản phẩm, tính tổng tiền.
   ============================================================ */

const DISCOUNT_RATE = 0.075; // 7.5% giảm giá khi có mã khuyến mãi mẫu

function emptyCartRowHTML() {
  return `<tr>
      <th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th>
    </tr>
    <tr>
      <td colspan="5" id="cartEmptyCell">
        <div id="cartEmptyIcon">🛒</div>
        <div id="cartEmptyTitle">Giỏ hàng trống</div>
        <p id="cartEmptyText">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <a href="products.html" id="cartEmptyLink">Tiếp tục mua sắm</a>
      </td>
    </tr>`;
}

function cartRowHTML(item, idx) {
  const itemTotal = item.price * item.qty;
  return `
    <tr class="cart-item" data-index="${idx}">
      <td>
        <div class="cart-item-content">
          <div class="product-image cart-item-image">${item.emoji}</div>
          <div><strong>${item.name}</strong></div>
        </div>
      </td>
      <td><strong class="unit-price">${formatPrice(item.price)} ₫</strong></td>
      <td>
        <div class="cart-qty-control">
          <button class="qty-btn qty-minus" type="button">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-plus" type="button">+</button>
        </div>
      </td>
      <td><strong class="total-price">${formatPrice(itemTotal)} ₫</strong></td>
      <td><button class="btn-delete delete-btn" type="button">Xóa</button></td>
    </tr>`;
}

function renderCart() {
  const cart = getCart();
  const cartTable = document.getElementById('cartTable');
  if (!cartTable) return;

  if (cart.length === 0) {
    cartTable.innerHTML = emptyCartRowHTML();
    return;
  }

  const rows = `<tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr>`
    + cart.map(cartRowHTML).join('');
  cartTable.innerHTML = rows;

  wireCartRowActions(cart);
}

function wireCartRowActions(cart) {
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.closest('.cart-item').dataset.index, 10);
      cart[idx].qty += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateTotals();
      updateHeaderCartCount();
    });
  });

  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.closest('.cart-item').dataset.index, 10);
      if (cart[idx].qty > 1) {
        cart[idx].qty -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotals();
        updateHeaderCartCount();
      } else {
        alert('Số lượng phải >= 1. Ấn nút Xóa để xóa sản phẩm!');
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.closest('.cart-item').dataset.index, 10);
      if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotals();
        updateHeaderCartCount();
      }
    });
  });
}

function updateTotals() {
  if (!document.getElementById('cartCount')) return;

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = cart.length > 0 ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discount;

  document.getElementById('cartCount').textContent = cart.length;
  document.getElementById('subtotal').textContent = formatPrice(subtotal) + ' ₫';
  document.getElementById('discountValue').textContent = '-' + formatPrice(discount) + ' ₫';
  document.getElementById('total').textContent = formatPrice(total) + ' ₫';

  document.querySelectorAll('#couponInput, #applyCouponBtn, #checkoutBtn').forEach(el => {
    if (cart.length > 0) {
      el.removeAttribute('disabled');
      el.style.opacity = '1';
    } else {
      el.setAttribute('disabled', 'disabled');
      el.style.opacity = '0.5';
    }
  });
}

function initCartPage() {
  if (!document.getElementById('cartTable')) return;
  renderCart();
  updateTotals();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại My Shop.');
      localStorage.setItem('cart', JSON.stringify([]));
      renderCart();
      updateTotals();
      updateHeaderCartCount();
    });
  }
}

document.addEventListener('DOMContentLoaded', initCartPage);

window.addEventListener('storage', () => {
  renderCart();
  updateTotals();
});
