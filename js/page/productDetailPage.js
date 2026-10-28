/**
 * productDetailPage.js - Xử lý logic Trang Chi Tiết Sản Phẩm
 * Đọc ID từ URL, render gallery ảnh 1:1 chống vỡ layout, chọn options, specs table và nút Mua ngay / Thêm giỏ
 */

import { initHeader } from '../components/header.js';
import { initFooter } from '../components/footer.js';
import { createProductCardHTML, bindProductCardEvents } from '../components/productCard.js';
import { productService } from '../services/productService.js';
import { cartService } from '../services/cartService.js';
import { formatCurrency, calculateDiscountPercent } from '../utils/format.js';
import { CATEGORIES } from '../data/defaultProducts.js';

const CATEGORY_ICONS = {
  phone: '📱',
  laptop: '💻',
  tablet: '📟',
  watch: '⌚',
  accessory: '🎧'
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Header và Footer
  initHeader('header-container');
  initFooter('footer-container');

  // 2. Đọc tham số ?id=... từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showNotFound('Vui lòng chọn một sản phẩm từ danh sách để xem chi tiết.');
    return;
  }

  // 3. Lấy dữ liệu sản phẩm từ Service
  const product = productService.getById(productId);

  if (!product) {
    showNotFound(`Không tìm thấy sản phẩm có mã ID "${productId}". Có thể sản phẩm đã bị xóa hoặc đường dẫn không đúng.`);
    return;
  }

  // 4. Render toàn bộ dữ liệu chi tiết sản phẩm
  renderProductDetail(product);

  // 5. Render danh sách sản phẩm tương tự cùng danh mục
  renderRelatedProducts(product);
});

/**
 * Hiển thị giao diện Không tìm thấy sản phẩm
 */
function showNotFound(message) {
  const contentEl = document.getElementById('detailContentSection');
  const notFoundEl = document.getElementById('detailNotFoundSection');
  const msgEl = document.getElementById('notFoundMessage');

  if (contentEl) contentEl.style.display = 'none';
  if (notFoundEl) notFoundEl.style.display = 'block';
  if (msgEl) msgEl.textContent = message;
}

/**
 * Render nội dung chi tiết sản phẩm
 */
function renderProductDetail(product) {
  // Cập nhật thẻ Title trang
  document.title = `${product.name} — Thế Giới Công Nghệ`;

  // 1. Breadcrumb
  const breadcrumbCategory = document.getElementById('detailBreadcrumbCategory');
  const breadcrumbProduct = document.getElementById('detailBreadcrumbProduct');
  const matchedCat = CATEGORIES.find(c => c.id === product.categoryId);
  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = matchedCat ? matchedCat.name : 'Sản phẩm';
    breadcrumbCategory.href = `product.html?category=${product.categoryId}`;
  }
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.name;
  }

  // 2. Header Tiêu đề & Đánh giá
  const titleEl = document.getElementById('detailProductName');
  const ratingEl = document.getElementById('detailRatingScore');
  const starsEl = document.getElementById('detailRatingStars');
  const reviewsEl = document.getElementById('detailReviewsCount');
  const stockBadgeEl = document.getElementById('detailStockBadge');

  if (titleEl) titleEl.textContent = product.name;
  if (ratingEl) ratingEl.textContent = Number(product.rating || 5).toFixed(1);
  if (starsEl) starsEl.textContent = '★'.repeat(Math.floor(product.rating || 5));
  if (reviewsEl) reviewsEl.textContent = `(${product.reviewCount || 0} đánh giá)`;
  if (stockBadgeEl) {
    const isAvailable = (product.stock ?? 1) > 0;
    stockBadgeEl.innerHTML = isAvailable 
      ? `<span>●</span> Còn hàng (Kho: ${product.stock || 20})` 
      : `<span style="color:#ef4444;">●</span> Tạm hết hàng`;
    if (!isAvailable) {
      stockBadgeEl.style.background = '#fee2e2';
      stockBadgeEl.style.color = '#dc2626';
    }
  }

  // 3. Gallery Ảnh & Chống Vỡ Layout
  initGallery(product);

  // 4. Giá bán & Khuyến mãi
  const currentPriceEl = document.getElementById('detailCurrentPrice');
  const origPriceEl = document.getElementById('detailOriginalPrice');
  const discountBadgeEl = document.getElementById('detailDiscountBadge');
  const installmentEstEl = document.getElementById('detailInstallmentEst');

  if (currentPriceEl) currentPriceEl.textContent = formatCurrency(product.price);
  if (origPriceEl) {
    if (product.originalPrice && product.originalPrice > product.price) {
      origPriceEl.textContent = formatCurrency(product.originalPrice);
      origPriceEl.style.display = 'inline';
    } else {
      origPriceEl.style.display = 'none';
    }
  }
  if (discountBadgeEl) {
    const discount = calculateDiscountPercent(product.price, product.originalPrice);
    if (discount > 0) {
      discountBadgeEl.textContent = `-${discount}%`;
      discountBadgeEl.style.display = 'inline-block';
    } else {
      discountBadgeEl.style.display = 'none';
    }
  }
  if (installmentEstEl) {
    const monthPrice = Math.round(product.price / 6);
    installmentEstEl.textContent = `Chỉ từ ${formatCurrency(monthPrice)}/tháng`;
  }

  // 5. Chọn phiên bản (Dung lượng) & Màu sắc
  const selectedOptions = {
    version: '256GB',
    color: 'Titan Tự Nhiên'
  };

  initOptionSelectors(product, selectedOptions);

  // 6. Bộ chọn số lượng (Quantity Controller)
  let currentQuantity = 1;
  const qtyInput = document.getElementById('detailQtyInput');
  const btnMinus = document.getElementById('btnQtyMinus');
  const btnPlus = document.getElementById('btnQtyPlus');

  if (btnMinus && btnPlus && qtyInput) {
    btnMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyInput.value = currentQuantity;
      }
    });

    btnPlus.addEventListener('click', () => {
      const maxStock = product.stock || 99;
      if (currentQuantity < maxStock) {
        currentQuantity++;
        qtyInput.value = currentQuantity;
      }
    });

    qtyInput.addEventListener('change', () => {
      const val = parseInt(qtyInput.value, 10);
      const maxStock = product.stock || 99;
      if (isNaN(val) || val < 1) currentQuantity = 1;
      else if (val > maxStock) currentQuantity = maxStock;
      else currentQuantity = val;
      qtyInput.value = currentQuantity;
    });
  }

  // 7. Nhóm Nút Mua Hàng (CTA)
  const btnBuyNow = document.getElementById('btnBuyNow');
  const btnAddCart = document.getElementById('btnAddToCart');

  if (btnAddCart) {
    btnAddCart.addEventListener('click', () => {
      cartService.addToCart(product, currentQuantity, selectedOptions);
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      cartService.addToCart(product, currentQuantity, selectedOptions);
      window.location.href = 'cart.html';
    });
  }

  // 8. Bảng Thông Số Kỹ Thuật (Specs Table)
  renderSpecsTable(product);

  // 9. Mô tả đặc điểm nổi bật
  const descEl = document.getElementById('detailProductDescription');
  if (descEl) {
    descEl.textContent = product.description || 'Sản phẩm chính hãng với công nghệ tiên tiến nhất, bảo hành 12 tháng tại các trung tâm trên toàn quốc.';
  }
}

/**
 * Khởi tạo Gallery ảnh và cơ chế Fallback chống vỡ layout
 */
function initGallery(product) {
  const mainImg = document.getElementById('detailMainImage');
  const placeholder = document.getElementById('detailImagePlaceholder');
  const placeholderIcon = document.getElementById('detailPlaceholderIcon');
  const placeholderName = document.getElementById('detailPlaceholderName');
  const thumbsContainer = document.getElementById('detailThumbnails');

  const categoryIcon = CATEGORY_ICONS[product.categoryId] || '📦';
  if (placeholderIcon) placeholderIcon.textContent = categoryIcon;
  if (placeholderName) placeholderName.textContent = product.name;

  const hasImage = Boolean(product.image && product.image.trim() !== '');

  if (hasImage && mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
    mainImg.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    mainImg.onerror = () => {
      mainImg.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    };
  } else {
    if (mainImg) mainImg.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }

  // Thumbnails
  if (thumbsContainer) {
    const imagesList = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);

    if (imagesList.length <= 1) {
      thumbsContainer.style.display = 'none';
    } else {
      thumbsContainer.style.display = 'flex';
      thumbsContainer.innerHTML = imagesList.map((imgUrl, idx) => `
        <div class="detail-thumb-item ${idx === 0 ? 'active' : ''}" data-src="${imgUrl}">
          <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" onerror="this.src='https://placehold.co/100x100?text=${product.categoryId}';" />
        </div>
      `).join('');

      thumbsContainer.querySelectorAll('.detail-thumb-item').forEach(thumb => {
        thumb.addEventListener('click', () => {
          thumbsContainer.querySelectorAll('.detail-thumb-item').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          const newSrc = thumb.dataset.src;
          if (mainImg) {
            mainImg.src = newSrc;
            mainImg.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
          }
        });
      });
    }
  }
}

/**
 * Khởi tạo bộ chọn phiên bản và màu sắc
 */
function initOptionSelectors(product, selectedOptions) {
  // Phiên bản dung lượng (derive từ specs hoặc mặc định)
  const versionListEl = document.getElementById('detailVersionList');
  if (versionListEl) {
    const versions = ['128GB', '256GB', '512GB'];
    versionListEl.innerHTML = versions.map((v, idx) => `
      <button type="button" class="detail-option-btn ${idx === 1 ? 'active' : ''}" data-version="${v}">
        <span>${v}</span>
      </button>
    `).join('');

    versionListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.detail-option-btn');
      if (!btn) return;
      versionListEl.querySelectorAll('.detail-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOptions.version = btn.dataset.version;
    });
  }

  // Màu sắc
  const colorListEl = document.getElementById('detailColorList');
  if (colorListEl) {
    const colors = ['Titan Tự Nhiên', 'Titan Sa Mạc', 'Đen Huyền Bí', 'Trắng Băng Tuyết'];
    colorListEl.innerHTML = colors.map((c, idx) => `
      <button type="button" class="detail-option-btn ${idx === 0 ? 'active' : ''}" data-color="${c}">
        <span>${c}</span>
      </button>
    `).join('');

    colorListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.detail-option-btn');
      if (!btn) return;
      colorListEl.querySelectorAll('.detail-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOptions.color = btn.dataset.color;
    });
  }
}

/**
 * Render bảng thông số kỹ thuật chi tiết
 */
function renderSpecsTable(product) {
  const tableEl = document.getElementById('detailSpecsTable');
  if (!tableEl) return;

  const specs = Array.isArray(product.specs) ? product.specs : [];
  
  // Dựng danh sách các dòng thông số chuẩn
  const rows = [
    { label: 'Thương hiệu / Hãng', value: product.brand },
    { label: 'Danh mục thiết bị', value: CATEGORIES.find(c => c.id === product.categoryId)?.name || product.categoryId },
    { label: 'Cấu hình chi tiết', value: specs.join(' • ') || 'Đang cập nhật' },
    { label: 'Bảo hành chính hãng', value: '12 tháng tại các trung tâm trên toàn quốc' },
    { label: 'Bộ sản phẩm gồm', value: 'Hộp, Máy, Cáp sạc, Sách hướng dẫn sử dụng' }
  ];

  tableEl.innerHTML = rows.map(r => `
    <tr>
      <td>${r.label}</td>
      <td><strong>${r.value}</strong></td>
    </tr>
  `).join('');
}

/**
 * Render khối sản phẩm tương tự cùng danh mục
 */
function renderRelatedProducts(product) {
  const grid = document.getElementById('detailRelatedGrid');
  if (!grid) return;

  const related = productService.filter(null, { categoryId: product.categoryId })
    .filter(p => p.id !== product.id)
    .slice(0, 6);

  if (related.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; color: #888; text-align: center; padding: 20px;">Không có thêm sản phẩm cùng loại.</div>`;
    return;
  }

  grid.innerHTML = related.map(p => createProductCardHTML(p)).join('');
  bindProductCardEvents(grid);
}
