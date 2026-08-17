/* ============================================================
   home.js
   Carousel/Slider trang chủ - tự code bằng JavaScript thuần
   (Next/Prev, chấm chọn, kéo chuột, tự động chuyển slide).
   Không dùng thư viện ngoài (Slick, Swiper, ...).
   ============================================================ */

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

/* ---------- Thêm vào giỏ cho các sản phẩm nổi bật trên trang chủ ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.home-featured .add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price, 10),
        emoji: card.dataset.emoji,
        qty: 1
      };

      const cart = getCart();
      const existing = cart.find(item => item.id === product.id);
      if (existing) existing.qty += 1;
      else cart.push(product);

      localStorage.setItem('cart', JSON.stringify(cart));
      updateHeaderCartCount();

      const originalText = btn.textContent;
      btn.textContent = '✓ Đã thêm!';
      setTimeout(() => { btn.textContent = originalText; }, 1200);
    });
  });
});
