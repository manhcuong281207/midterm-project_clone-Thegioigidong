/**
 * productCard.js - Component hiển thị thẻ sản phẩm tái sử dụng
 * Tuân thủ UI_DESIGN_GUIDELINES.md và xử lý chống vỡ layout khi ảnh lỗi / không tồn tại
 */

import { formatCurrency, calculateDiscountPercent } from '../utils/format.js';
import { cartService } from '../services/cartService.js';
import { productService } from '../services/productService.js';

const CATEGORY_ICONS = {
  phone: '📱',
  laptop: '💻',
  tablet: '📟',
  watch: '⌚',
  accessory: '🎧'
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Tạo chuỗi HTML cho một thẻ sản phẩm chuẩn TGDD
 * @param {Object} product - Đối tượng sản phẩm
 * @param {Object} [options]
 * @param {'default'|'flash-sale'|'deal'} [options.variant='default']
 * @returns {string} Chuỗi HTML của thẻ
 */
export function createProductCardHTML(product, options = {}) {
  if (!product) return '';

  const variant = options.variant || (product.isFlashSale ? 'flash-sale' : 'default');
  const discountPercent = calculateDiscountPercent(product.price, product.originalPrice);
  const categoryIcon = CATEGORY_ICONS[product.categoryId] || '📦';
  const detailUrl = `product-detail.html?id=${encodeURIComponent(product.id)}`;

  // Nhãn khuyến mãi (Labels / Badges)
  const labels = Array.isArray(product.labels) ? product.labels : [];
  const badgesHtml = labels.map(label => {
    const isHot = label.toLowerCase().includes('sốc') || label.toLowerCase().includes('hot');
    const isDeal = label.toLowerCase().includes('trả góp') || label.toLowerCase().includes('ai');
    const cls = isHot ? 'product-card__badge--hot' : isDeal ? 'product-card__badge--deal' : '';
    return `<span class="product-card__badge ${cls}">${escapeHtml(label)}</span>`;
  }).join('');

  // Cấu hình vắn tắt (Chips / Specs)
  const specs = Array.isArray(product.specs) ? product.specs.slice(0, 3) : [];
  const specsHtml = specs.map(s => `<span class="product-card__spec-chip">${escapeHtml(s)}</span>`).join('');

  // Đánh giá sao
  const rating = Number(product.rating) || 5;
  const fullStars = '★'.repeat(Math.floor(rating));
  const halfOrEmpty = '☆'.repeat(5 - Math.floor(rating));
  const reviewsCountText = product.reviewCount ? `(${product.reviewCount})` : '';

  // Khung ảnh xử lý chống vỡ layout:
  // Nếu ảnh rỗng hoặc bị 404, fallback placeholder kích hoạt tự động với icon và tên sản phẩm, giữ nguyên 1:1
  const hasImage = Boolean(product.image && product.image.trim() !== '');

  const imageBoxHtml = `
    <div class="product-card__image-box">
      <!-- Fallback Placeholder: Luôn hiện nếu ảnh rỗng hoặc gặp lỗi 404 -->
      <div class="product-card__placeholder" style="${hasImage ? 'display: none;' : 'display: flex;'}">
        <span class="product-card__placeholder-icon">${categoryIcon}</span>
        <span class="product-card__placeholder-text">${escapeHtml(product.name)}</span>
        <span style="font-size: 10px; color: #94a3b8;">${escapeHtml(product.brand)}</span>
      </div>
      ${hasImage ? `
        <img 
          src="${escapeHtml(product.image)}" 
          alt="${escapeHtml(product.name)}" 
          class="product-card__image" 
          loading="lazy"
          onerror="this.style.display='none'; if(this.previousElementSibling) this.previousElementSibling.style.display='flex';"
        />
      ` : ''}
    </div>
  `;

  // Thanh tiến độ Flash Sale (chỉ hiện khi variant flash-sale)
  let flashProgressHtml = '';
  if (variant === 'flash-sale' && product.flashSaleProgress !== undefined) {
    const progress = Math.min(100, Math.max(10, Number(product.flashSaleProgress) || 50));
    flashProgressHtml = `
      <div class="product-card__progress-wrap">
        <div class="product-card__progress-bar">
          <div class="product-card__progress-fill" style="width: ${progress}%;"></div>
          <span class="product-card__progress-text">ĐÃ BÁN ${progress}%</span>
        </div>
      </div>
    `;
  }

  return `
    <article class="product-card" data-product-id="${escapeHtml(product.id)}">
      <a href="${detailUrl}" title="${escapeHtml(product.name)}">
        ${imageBoxHtml}
      </a>

      <div class="product-card__badge-row">
        ${badgesHtml}
      </div>

      <a href="${detailUrl}" class="product-card__name" title="${escapeHtml(product.name)}">
        ${escapeHtml(product.name)}
      </a>

      <div class="product-card__specs">
        ${specsHtml}
      </div>

      <div class="product-card__price-row">
        <span class="product-card__price">${formatCurrency(product.price)}</span>
        ${product.originalPrice && product.originalPrice > product.price ? `
          <span class="product-card__old-price">${formatCurrency(product.originalPrice)}</span>
          <span class="product-card__discount-tag">-${discountPercent}%</span>
        ` : ''}
      </div>

      <div class="product-card__rating">
        <span class="product-card__stars">${fullStars}${halfOrEmpty}</span>
        <span>${rating.toFixed(1)}</span>
        <span>${reviewsCountText}</span>
      </div>

      ${flashProgressHtml}

      <div class="product-card__actions">
        <a href="${detailUrl}" class="btn-card-action btn-card-action--detail">Chi tiết</a>
        <button type="button" class="btn-card-action btn-card-action--cart js-add-to-cart" data-id="${escapeHtml(product.id)}" title="Thêm vào giỏ hàng">
          🛒 Thêm
        </button>
      </div>
    </article>
  `;
}

/**
 * Lắng nghe các sự kiện click "Thêm vào giỏ" trên toàn bộ thẻ sản phẩm trong một container
 * @param {HTMLElement} [container=document]
 */
export function bindProductCardEvents(container = document) {
  const buttons = container.querySelectorAll('.js-add-to-cart');
  buttons.forEach(btn => {
    // Tránh gán trùng event
    if (btn.dataset.bound) return;
    btn.dataset.bound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prodId = btn.getAttribute('data-id');
      if (!prodId) return;

      const product = productService.getById(prodId);
      if (product) {
        cartService.addToCart(product, 1);
      }
    });
  });
}
