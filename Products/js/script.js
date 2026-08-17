// index //
function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

    // carousel
    document.addEventListener('DOMContentLoaded', () => {
        const heroBanner = document.getElementById('homeHero');
        const track = document.getElementById('heroTrack');
        const slides = Array.from(track.children);
        const prevBtn = document.getElementById('heroPrev');
        const nextBtn = document.getElementById('heroNext');
        const dotsNav = document.getElementById('heroDots');
        const dots = Array.from(dotsNav.children);

        let currentIndex = 0;
        let slideInterval = null;
        const AUTO_PLAY_DELAY = 4000;

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
        }

        function stopAutoPlay() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });

        dotsNav.addEventListener('click', (e) => {
            const targetDot = e.target.closest('.hero-dot');
            if (!targetDot) return;

            const targetIndex = parseInt(targetDot.dataset.slide, 10);
            goToSlide(targetIndex);
            startAutoPlay();
        });

        heroBanner.addEventListener('mouseenter', stopAutoPlay);
        heroBanner.addEventListener('mouseleave', startAutoPlay);

        goToSlide(0);
        startAutoPlay();
    });


document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price),
        emoji: card.dataset.emoji,
        qty: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const originalText = btn.textContent;
    btn.textContent = '✓ Đã thêm!';
    btn.style.background = '#10b981';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
    });
});

// detail //
document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'products.html';
    });
});

document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'products.html';
    });
});
// cart //
const DISCOUNT_RATE = 0.075; // 7.5% giảm giá

function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cartTable');
    if (!cartTable) return;

    if (cart.length === 0) {
    cartTable.innerHTML = `<tr>
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
    return;
    }

    let html = `<tr>
    <th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th>
    </tr>`;

    cart.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    html += `
    <tr class="cart-item" data-index="${idx}" data-price="${item.price}">
        <td>
        <div class="cart-item-content">
            <div class="product-image cart-item-image">${item.emoji}</div>
            <div>
            <strong>${item.name}</strong>
            </div>
        </div>
        </td>
        <td><strong class="unit-price">${formatPrice(item.price)} ₫</strong></td>
        <td>
        <div class="cart-qty-control">
            <button class="qty-btn qty-minus">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus">+</button>
        </div>
        </td>
        <td><strong class="total-price">${formatPrice(itemTotal)} ₫</strong></td>
        <td><button class="btn-delete delete-btn">Xóa</button></td>
    </tr>`;
    });

    cartTable.innerHTML = html;

    document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item');
        const idx = parseInt(row.dataset.index);
        cart[idx].qty += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotals();
    });
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item');
        const idx = parseInt(row.dataset.index);
        if (cart[idx].qty > 1) {
        cart[idx].qty -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotals();
        } else {
        alert('Số lượng phải >= 1. Ấn nút Xóa để xóa sản phẩm!');
        }
    });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item');
        const idx = parseInt(row.dataset.index);
        if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateTotals();
        }
    });
    });
}

function updateTotals() {
    if (!document.getElementById('cartCount')) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
    subtotal += item.price * item.qty;
    });

    const discount = Math.round(subtotal * DISCOUNT_RATE);
    const total = subtotal - discount;

    document.getElementById('cartCount').textContent = cart.length;
    document.getElementById('subtotal').textContent = formatPrice(subtotal) + ' ₫';
    document.getElementById('discountValue').textContent = '-' + formatPrice(discount) + ' ₫';
    document.getElementById('total').textContent = formatPrice(total) + ' ₫';

    const inputs = document.querySelectorAll('input[disabled], button[disabled]');
    if (cart.length > 0) {
    inputs.forEach(el => {
        el.removeAttribute('disabled');
        el.style.opacity = '1';
    });
    }
}

renderCart();
updateTotals();

window.addEventListener('storage', () => {
    renderCart();
    updateTotals();
});
document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'products.html';
    });
});

// login //

document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'products.html';
    });
});

// forgot password //
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleContactType');
  const forgotText = document.getElementById('forgotText');
  const forgotLabel = document.getElementById('forgotLabel');
  const forgotInput = document.getElementById('forgotInput');

  if (!toggleButton || !forgotText || !forgotLabel || !forgotInput) {
    console.error("Không tìm thấy đủ các phần tử cần thiết");
    return;
  }

  let isPhoneMode = false;

  function updateUI() {
    if (isPhoneMode) {
      forgotText.textContent = 'Nhập số điện thoại của bạn để nhận mã xác minh.';
      forgotLabel.textContent = 'Số điện thoại';
      forgotInput.type = 'tel';
      forgotInput.placeholder = '0987654321';
      forgotInput.name = 'phone';
      toggleButton.textContent = 'Hoặc email';
    } else {
      forgotText.textContent = 'Nhập email của bạn để nhận mã xác minh.';
      forgotLabel.textContent = 'Email';
      forgotInput.type = 'email';
      forgotInput.placeholder = 'example@email.com';
      forgotInput.name = 'email';
      toggleButton.textContent = 'Hoặc số điện thoại';
    }
    forgotInput.value = '';
  }

  updateUI();

  toggleButton.addEventListener('click', () => {
    isPhoneMode = !isPhoneMode;
    updateUI();
  });
});

// profile //
document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'products.html';
    });
});

// products //
const categoryLinks = document.querySelectorAll('.category-nav a');
const productCards = document.querySelectorAll('.product-card');

categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = link.dataset.category;

    categoryLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    productCards.forEach(card => {
        if (card.dataset.category === category) {
        card.style.display = '';
        } else {
        card.style.display = 'none';
        }
    });
    });
});

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price),
        emoji: card.dataset.emoji,
        qty: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const originalText = btn.textContent;
    btn.textContent = '✓ Đã thêm!';
    btn.style.background = '#10b981';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
    });
});

