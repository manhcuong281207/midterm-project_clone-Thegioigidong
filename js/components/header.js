/**
 * header.js - Component Header ghim (Sticky Header) & Thanh điều hướng dùng chung
 * Tự động đồng bộ số lượng giỏ hàng theo thời gian thực và xử lý tìm kiếm
 */

import { cartService } from '../services/cartService.js';
import { CATEGORIES } from '../data/defaultProducts.js';

/**
 * Render Header vào container hoặc đầu body
 * @param {string} [containerId='header-container']
 */
export function initHeader(containerId = 'header-container') {
  let container = document.getElementById(containerId);

  // Nếu trang chưa có thẻ chứa, tự động tạo và chèn vào đầu body
  if (!container) {
    container = document.createElement('header');
    container.id = containerId;
    container.className = 'site-header';
    document.body.prepend(container);
  } else {
    container.className = 'site-header';
  }

  // Lấy category hiện tại từ URL để active menu
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category') || '';
  const currentSearch = urlParams.get('search') || '';
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const categoriesNavHtml = CATEGORIES.map(cat => {
    const isActive = currentCategory === cat.id ? 'active' : '';
    return `
      <li class="header-nav__item ${isActive}">
        <a href="product.html?category=${cat.id}">
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
        </a>
      </li>
    `;
  }).join('');

  container.innerHTML = `
    <div class="header-main">
      <div class="container header-top">
        <!-- Logo -->
        <a href="index.html" class="header-logo" title="Trang chủ Thế Giới Công Nghệ">
          <span>TGCN</span>
          <span class="header-logo__badge">Clone</span>
        </a>

        <!-- Thanh tìm kiếm -->
        <div class="header-search">
          <form class="header-search__form" id="headerSearchForm" action="product.html" method="GET">
            <input 
              type="text" 
              name="search" 
              class="header-search__input" 
              placeholder="Bạn tìm gì hôm nay? (VD: iPhone, S24, MacBook...)" 
              value="${currentSearch.replace(/"/g, '&quot;')}"
              autocomplete="off"
            />
            <button type="submit" class="header-search__submit" aria-label="Tìm kiếm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        <!-- Các nút tiện ích (Giỏ hàng, Quản trị Admin) -->
        <div class="header-actions">
          <a href="cart.html" class="header-btn" id="headerCartBtn" title="Xem giỏ hàng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Giỏ hàng</span>
            <span class="header-btn__badge" id="headerCartCount">${cartService.getCartCount()}</span>
          </a>

          <a href="admin.html" class="header-btn" title="Trang Quản trị CRUD">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Quản trị</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Thanh Menu danh mục dưới header -->
    <nav class="header-nav">
      <div class="container">
        <ul class="header-nav__list">
          <li class="header-nav__item ${currentPage === 'index.html' ? 'active' : ''}">
            <a href="index.html">
              <span>🏠</span>
              <span>Trang chủ</span>
            </a>
          </li>
          <li class="header-nav__item ${currentPage === 'product.html' && !currentCategory ? 'active' : ''}">
            <a href="product.html">
              <span>📦</span>
              <span>Tất cả</span>
            </a>
          </li>
          ${categoriesNavHtml}
        </ul>
      </div>
    </nav>
  `;

  // Xử lý sự kiện tìm kiếm
  const searchForm = container.querySelector('#headerSearchForm');
  searchForm.addEventListener('submit', (e) => {
    const input = searchForm.querySelector('input[name="search"]');
    const query = input.value.trim();
    if (!query) {
      e.preventDefault();
      window.location.href = 'product.html';
    }
  });

  // Lắng nghe cập nhật giỏ hàng theo thời gian thực
  const badgeElement = container.querySelector('#headerCartCount');
  cartService.onCartChange((detail) => {
    if (badgeElement) {
      badgeElement.textContent = detail.count;
      // Hiệu ứng nảy nhẹ badge
      badgeElement.style.transform = 'scale(1.3)';
      setTimeout(() => {
        badgeElement.style.transform = 'scale(1)';
      }, 200);
    }
  });
}
