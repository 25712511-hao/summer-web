document.addEventListener('DOMContentLoaded', () => {
  const heroBanner = document.getElementById('homeHero');
  const track = document.getElementById('heroTrack');
  if (!heroBanner || !track) return;

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

async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  try {

    let products = [];
    if (typeof fetchAllProducts === 'function') {
      products = await fetchAllProducts();
    } else {
      const res = await fetch('http://localhost:3000/products');
      products = await res.json();
    }


    const featuredList = products.slice(0, 8);

  
   container.innerHTML = featuredList.map(p => `
  <div class="product-card" data-id="${p.id}">
    ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
    
    <a href="html/detail.html?id=${p.id}" class="product-link">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-title">${p.name}</div>
      <div class="product-desc">${p.description || ''}</div>
    </a>

    <div class="product-rating">
      <span class="stars">★★★★★</span> (${p.reviewCount || 0} đánh giá)
    </div>

    <div class="product-price">
      ${typeof formatPrice === 'function' ? formatPrice(p.price) : p.price} ₫
    </div>

    <button class="add-to-cart add-to-cart-btn">Thêm vào giỏ</button>
  </div>
`).join('');
    container.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const productId = card.dataset.id;
        const product = products.find(p => p.id == productId);

        if (product) {
          const cart = typeof getCart === 'function' ? getCart() : JSON.parse(localStorage.getItem('cart') || '[]');
          const existing = cart.find(item => item.id === product.id);
          
          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              qty: 1
            });
          }
          
          localStorage.setItem('cart', JSON.stringify(cart));
          if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount();

          const originalText = btn.textContent;
          btn.textContent = '✓ Đã thêm!';
          setTimeout(() => { btn.textContent = originalText; }, 1200);
        }
      });
    });

  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadFeaturedProducts);
