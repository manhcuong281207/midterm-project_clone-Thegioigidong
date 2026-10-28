/**
 * homePage.js - Logic điều khiển riêng cho Trang Chủ
 * Khởi tạo Header/Footer, Slider banner, Flash Sale đếm ngược và các khối sản phẩm
 */

import { initHeader } from '../components/header.js';
import { initFooter } from '../components/footer.js';
import { createProductCardHTML, bindProductCardEvents } from '../components/productCard.js';
import { productService } from '../services/productService.js';
import { HERO_BANNERS, PAYMENT_BENEFITS, PROMO_MINI_BANNERS } from '../data/banners.js';
import { CATEGORIES } from '../data/defaultProducts.js';

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // 1. Render Header ghim và Footer chung
  initHeader('header-container');
  initFooter('footer-container');

  // 2. Khởi tạo Banner Hero Carousel
  initHeroSlider();

  // 3. Render Dải Lợi Ích Thanh Toán
  renderPaymentBenefits();

  // 4. Khởi tạo Khối Flash Sale ("Khuyến mãi online")
  initFlashSaleSection();

  // 5. Khởi tạo Khối Deal Đỏ ("Deal đẹp có hạn")
  initDealSection();

  // 6. Render Mini Banners đôi
  renderMiniBanners();

  // 7. Render Khối Sản Phẩm Nổi Bật theo chuyên mục
  renderFeaturedSections();

  // 8. Gắn sự kiện mua hàng cho toàn bộ sản phẩm trên trang
  bindProductCardEvents(document);
});

/* ==========================================================================
   1. HERO BANNER CAROUSEL LOGIC
   ========================================================================== */
function initHeroSlider() {
  const sliderWrap = document.getElementById('heroSliderWrap');
  if (!sliderWrap) return;

  const track = sliderWrap.querySelector('.hero-slider-track');
  const dotsContainer = sliderWrap.querySelector('.hero-slider-dots');
  const prevBtn = sliderWrap.querySelector('.hero-slider-arrow--prev');
  const nextBtn = sliderWrap.querySelector('.hero-slider-arrow--next');

  // Render slides từ dữ liệu HERO_BANNERS
  track.innerHTML = HERO_BANNERS.map((banner, index) => {
    return `
      <div class="hero-slide" data-index="${index}">
        <a href="${banner.link || 'product.html'}" style="display:block; width:100%; height:100%; position:relative;">
          <div class="hero-slide__fallback" style="background: ${banner.fallbackBg || '#1e293b'};">
            <h2>${banner.title}</h2>
            <p>${banner.subtitle}</p>
            <span class="btn-slide-cta">Xem Ngay &rarr;</span>
          </div>
          ${banner.image ? `
            <img 
              src="${banner.image}" 
              alt="${banner.title}" 
              class="hero-slide__img" 
              onerror="this.style.display='none';" 
            />
          ` : ''}
        </a>
      </div>
    `;
  }).join('');

  // Render dots
  dotsContainer.innerHTML = HERO_BANNERS.map((_, index) => {
    return `<div class="hero-slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`;
  }).join('');

  let currentIndex = 0;
  const totalSlides = HERO_BANNERS.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer.querySelectorAll('.hero-slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

  dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('hero-slider-dot')) {
      const idx = parseInt(e.target.dataset.index, 10);
      goToSlide(idx);
      startAutoSlide();
    }
  });

  sliderWrap.addEventListener('mouseenter', stopAutoSlide);
  sliderWrap.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
}

/* ==========================================================================
   2. DẢI TIỆN ÍCH THANH TOÁN
   ========================================================================== */
function renderPaymentBenefits() {
  const container = document.getElementById('benefitStripContainer');
  if (!container) return;

  container.innerHTML = PAYMENT_BENEFITS.map(item => `
    <div class="benefit-item">
      <div class="benefit-icon">${item.icon}</div>
      <div class="benefit-text">
        <h4>${item.title}</h4>
        <p>${item.subtitle}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   3. FLASH SALE ĐẾM NGƯỢC
   ========================================================================== */
function initFlashSaleSection() {
  const grid = document.getElementById('flashSaleGrid');
  const tabsWrap = document.getElementById('flashSaleTabs');
  const hourEl = document.getElementById('cdHours');
  const minEl = document.getElementById('cdMinutes');
  const secEl = document.getElementById('cdSeconds');

  // Đếm ngược giờ vàng chạy từng giây
  function updateCountdown() {
    const now = new Date();
    // Đếm ngược tới 23:59:59 của ngày hôm nay
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let diff = Math.max(0, Math.floor((endOfDay - now) / 1000));
    const h = Math.floor(diff / 3600);
    diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;

    if (hourEl) hourEl.textContent = String(h).padStart(2, '0');
    if (minEl) minEl.textContent = String(m).padStart(2, '0');
    if (secEl) secEl.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Lọc sản phẩm có isFlashSale: true
  const allFlash = productService.filter(null, { isFlashSale: true });

  // Render Tabs
  if (tabsWrap) {
    const tabCategories = [{ id: 'all', name: 'Tất cả deal' }, ...CATEGORIES];
    tabsWrap.innerHTML = tabCategories.map((cat, idx) => `
      <button type="button" class="tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabsWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const catId = btn.dataset.cat;
      renderFlashProducts(catId);
    });
  }

  function renderFlashProducts(catId = 'all') {
    if (!grid) return;
    const filtered = catId === 'all' ? allFlash : allFlash.filter(p => p.categoryId === catId);
    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: #888;">Đang cập nhật thêm khuyến mãi trong danh mục này...</div>`;
      return;
    }
    grid.innerHTML = filtered.slice(0, 6).map(p => createProductCardHTML(p, { variant: 'flash-sale' })).join('');
    bindProductCardEvents(grid);
  }

  renderFlashProducts('all');
}

/* ==========================================================================
   4. DEAL SECTION (NỀN ĐỎ CHIẾN DỊCH)
   ========================================================================== */
function initDealSection() {
  const grid = document.getElementById('dealGrid');
  const tabsWrap = document.getElementById('dealTabs');
  if (!grid) return;

  const dealProducts = productService.getAll().slice(0, 6);

  if (tabsWrap) {
    tabsWrap.innerHTML = `
      <button type="button" class="tab-btn active" data-cat="all">Tất Cả</button>
      <button type="button" class="tab-btn" data-cat="phone">Điện Thoại</button>
      <button type="button" class="tab-btn" data-cat="laptop">Laptop</button>
      <button type="button" class="tab-btn" data-cat="watch">Đồng Hồ</button>
    `;

    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabsWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      const list = cat === 'all' ? dealProducts : productService.filter(null, { categoryId: cat }).slice(0, 6);
      grid.innerHTML = list.map(p => createProductCardHTML(p, { variant: 'deal' })).join('');
      bindProductCardEvents(grid);
    });
  }

  grid.innerHTML = dealProducts.map(p => createProductCardHTML(p, { variant: 'deal' })).join('');
  bindProductCardEvents(grid);
}

/* ==========================================================================
   5. MINI PROMO BANNERS
   ========================================================================== */
function renderMiniBanners() {
  const container = document.getElementById('miniBannersContainer');
  if (!container) return;

  container.innerHTML = PROMO_MINI_BANNERS.map(b => `
    <a href="${b.link}" class="mini-banner-card" style="background: ${b.fallbackBg};">
      <div>
        <h3>${b.title}</h3>
        <p>Khám phá ưu đãi hấp dẫn ngay hôm nay &rarr;</p>
      </div>
    </a>
  `).join('');
}

/* ==========================================================================
   6. SẢN PHẨM NỔI BẬT THEO CHUYÊN MỤC
   ========================================================================== */
function renderFeaturedSections() {
  // 1. Điện thoại nổi bật nhất
  const phoneGrid = document.getElementById('phoneFeaturedGrid');
  if (phoneGrid) {
    const phones = productService.filter(null, { categoryId: 'phone' }).slice(0, 6);
    phoneGrid.innerHTML = phones.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(phoneGrid);
  }

  // 2. Laptop bán chạy
  const laptopGrid = document.getElementById('laptopFeaturedGrid');
  if (laptopGrid) {
    const laptops = productService.filter(null, { categoryId: 'laptop' }).slice(0, 6);
    laptopGrid.innerHTML = laptops.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(laptopGrid);
  }

  // 3. Gợi ý cho bạn (Tất cả sản phẩm)
  const recommendGrid = document.getElementById('recommendGrid');
  if (recommendGrid) {
    const all = productService.getAll().slice(0, 12);
    recommendGrid.innerHTML = all.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(recommendGrid);
  }
}
