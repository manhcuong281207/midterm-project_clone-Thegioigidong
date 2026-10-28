/**
 * adminPage.js - Bộ điều khiển logic toàn diện cho Trang Quản Trị Hệ Thống (Admin CRUD)
 * Đầy đủ tính năng: Thống kê tổng quan, Thêm/Sửa/Xóa sản phẩm, Tìm kiếm, Lọc, Sắp xếp, Phân trang và Khôi phục mẫu
 */

import { productService } from '../services/productService.js';
import { CATEGORIES, BRANDS } from '../data/defaultProducts.js';
import { validateProduct } from '../utils/validator.js';
import { formatCurrency, calculateDiscountPercent, removeVietnameseTones } from '../utils/format.js';
import { showToast } from '../utils/toast.js';

/* ==========================================================================
   1. HẰNG SỐ & BẢNG TRA CỨU
   ========================================================================== */
const CATEGORY_ICONS = {
  phone: '📱',
  laptop: '💻',
  tablet: '📟',
  watch: '⌚',
  accessory: '🎧'
};

const CATEGORY_NAMES = {
  phone: 'Điện thoại',
  laptop: 'Laptop',
  tablet: 'Máy tính bảng',
  watch: 'Smartwatch',
  accessory: 'Phụ kiện'
};

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ==========================================================================
   2. TRẠNG THÁI TOÀN TRANG (APPLICATION STATE)
   ========================================================================== */
const state = {
  allProducts: [],
  filteredProducts: [],
  searchTerm: '',
  selectedCategory: 'all',
  selectedStockFilter: 'all',
  sortBy: 'newest',
  currentPage: 1,
  pageSize: 10,
  editingProductId: null,
  deletingProductId: null
};

/* ==========================================================================
   3. KHỞI TẠO VÀ TẢI DỮ LIỆU
   ========================================================================== */
export function initAdminPage() {
  productService.init();
  loadData();
  setupEventListeners();
  startClock();
}

/**
 * Tải lại dữ liệu từ productService và áp dụng bộ lọc
 */
function loadData() {
  state.allProducts = productService.getAll();
  renderStats();
  applyFiltersAndSort();
  renderTable();
}

/**
 * Bắt đầu đồng hồ thời gian thực
 */
function startClock() {
  const clockEl = document.getElementById('clockText');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} — ${day}/${month}/${now.getFullYear()}`;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. THỐNG KÊ TỔNG QUAN (STATS OVERVIEW)
   ========================================================================== */
function renderStats() {
  const products = state.allProducts;
  const total = products.length;

  const phones = products.filter(p => p.categoryId === 'phone').length;
  const laptops = products.filter(p => p.categoryId === 'laptop').length;
  const tablets = products.filter(p => p.categoryId === 'tablet').length;
  const others = products.filter(p => p.categoryId === 'watch' || p.categoryId === 'accessory').length;
  const flashSales = products.filter(p => Boolean(p.isFlashSale)).length;
  const lowStock = products.filter(p => (Number(p.stock) || 0) <= 5).length;

  const totalValue = products.reduce((sum, p) => {
    const price = Number(p.price) || 0;
    const stock = Number(p.stock) || 0;
    return sum + (price * stock);
  }, 0);

  // Cập nhật DOM Stats Cards
  setElText('statTotalProducts', total);
  setElText('sidebarProductCount', total);
  setElText('statPhones', phones);
  setElText('statLaptops', laptops);
  setElText('statTablets', tablets);
  setElText('statOthers', others);
  setElText('statFlashSales', flashSales);
  setElText('statLowStock', lowStock);
  setElText('statTotalStockValue', formatCurrency(totalValue));

  // Tỷ lệ phần trăm ngành hàng
  if (total > 0) {
    setElText('statPhoneRatio', `${Math.round((phones / total) * 100)}% danh mục`);
    setElText('statLaptopRatio', `${Math.round((laptops / total) * 100)}% danh mục`);
    setElText('statTabletRatio', `${Math.round((tablets / total) * 100)}% danh mục`);
    setElText('statOthersRatio', `${Math.round((others / total) * 100)}% danh mục`);
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ==========================================================================
   5. BỘ LỌC, TÌM KIẾM & SẮP XẾP
   ========================================================================== */
function applyFiltersAndSort() {
  let list = [...state.allProducts];

  // 1. Tìm kiếm theo từ khóa (hỗ trợ tiếng Việt không dấu)
  if (state.searchTerm && state.searchTerm.trim() !== '') {
    const cleanKw = removeVietnameseTones(state.searchTerm);
    list = list.filter(p => {
      const matchName = removeVietnameseTones(p.name || '').includes(cleanKw);
      const matchBrand = removeVietnameseTones(p.brand || '').includes(cleanKw);
      const matchCategory = removeVietnameseTones(p.categoryId || '').includes(cleanKw);
      const matchSpecs = Array.isArray(p.specs) && p.specs.some(s => removeVietnameseTones(s).includes(cleanKw));
      const matchId = String(p.id || '').toLowerCase().includes(cleanKw);
      return matchName || matchBrand || matchCategory || matchSpecs || matchId;
    });
  }

  // 2. Lọc theo danh mục
  if (state.selectedCategory && state.selectedCategory !== 'all') {
    list = list.filter(p => p.categoryId === state.selectedCategory);
  }

  // 3. Lọc theo tình trạng tồn kho
  if (state.selectedStockFilter && state.selectedStockFilter !== 'all') {
    if (state.selectedStockFilter === 'in_stock') {
      list = list.filter(p => (Number(p.stock) || 0) > 5);
    } else if (state.selectedStockFilter === 'low_stock') {
      list = list.filter(p => {
        const s = Number(p.stock) || 0;
        return s >= 1 && s <= 5;
      });
    } else if (state.selectedStockFilter === 'out_of_stock') {
      list = list.filter(p => (Number(p.stock) || 0) === 0);
    }
  }

  // 4. Sắp xếp
  switch (state.sortBy) {
    case 'price-asc':
      list.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      list.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'stock-desc':
      list.sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0));
      break;
    case 'stock-asc':
      list.sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));
      break;
    case 'name-asc':
      list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'vi'));
      break;
    case 'newest':
    default:
      // Sản phẩm vừa thêm/cập nhật lên đầu
      list.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      break;
  }

  state.filteredProducts = list;

  // Điều chỉnh phân trang nếu trang hiện tại vượt quá số trang tối đa
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.currentPage > totalPages) {
    state.currentPage = totalPages;
  }
}

/* ==========================================================================
   6. RENDER BẢNG SẢN PHẨM & PHÂN TRANG
   ========================================================================== */
function renderTable() {
  const tbody = document.getElementById('adminProductTableBody');
  const emptyState = document.getElementById('tableEmptyState');
  const footer = document.getElementById('tableFooter');
  if (!tbody) return;

  const totalFiltered = state.filteredProducts.length;
  const totalAll = state.allProducts.length;

  // Cập nhật thanh trạng thái
  setElText('filterMatchCount', totalFiltered);
  setElText('filterTotalCount', totalAll);

  // Hiển thị các tag bộ lọc đang áp dụng
  renderActiveFilterTags();

  if (totalFiltered === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footer) footer.style.display = 'flex';

  // Tính toán chỉ số phân trang
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const endIndex = Math.min(startIndex + state.pageSize, totalFiltered);
  const pageItems = state.filteredProducts.slice(startIndex, endIndex);

  // Render các hàng dữ liệu
  tbody.innerHTML = pageItems.map((p, idx) => {
    const stt = startIndex + idx + 1;
    const catIcon = CATEGORY_ICONS[p.categoryId] || '📦';
    const catName = CATEGORY_NAMES[p.categoryId] || p.categoryId;
    const hasImage = Boolean(p.image && p.image.trim() !== '');

    // Tồn kho & Badge cảnh báo
    const stock = Number(p.stock) || 0;
    let stockClass = 'stock-in';
    let stockLabel = `${stock} chiếc`;
    if (stock === 0) {
      stockClass = 'stock-out';
      stockLabel = 'Hết hàng (0)';
    } else if (stock <= 5) {
      stockClass = 'stock-low';
      stockLabel = `Còn ${stock} (Ít)`;
    }

    // Giá và giảm giá
    const priceFormatted = formatCurrency(p.price);
    const originalPriceFormatted = p.originalPrice && Number(p.originalPrice) > Number(p.price)
      ? formatCurrency(p.originalPrice)
      : '';
    const discountPercent = calculateDiscountPercent(p.price, p.originalPrice);

    return `
      <tr data-id="${escapeHtml(p.id)}">
        <!-- STT -->
        <td style="text-align: center; color: #64748b; font-weight: 600;">${stt}</td>

        <!-- ẢNH VỚI CHỐNG VỠ LAYOUT (FALLBACK PLACEHOLDER) -->
        <td class="table-thumb-cell">
          <div class="table-thumb-box" title="${escapeHtml(p.name)}">
            <div class="table-thumb-placeholder" style="${hasImage ? 'display: none;' : 'display: flex;'}">
              <span>${catIcon}</span>
            </div>
            ${hasImage ? `
              <img 
                src="${escapeHtml(p.image)}" 
                alt="${escapeHtml(p.name)}" 
                class="table-thumb-img" 
                loading="lazy"
                onerror="this.style.display='none'; if(this.previousElementSibling) this.previousElementSibling.style.display='flex';"
              />
            ` : ''}
          </div>
        </td>

        <!-- TÊN SẢN PHẨM & ID -->
        <td>
          <a href="product-detail.html?id=${encodeURIComponent(p.id)}" target="_blank" class="table-product-name" title="Xem trên web">
            ${escapeHtml(p.name)}
          </a>
          <div class="table-product-sub">
            <span class="table-product-id">ID: ${escapeHtml(p.id)}</span>
            ${p.isFeatured ? '<span style="color: #f59e0b; font-weight: 700;">⭐ Nổi bật</span>' : ''}
          </div>
        </td>

        <!-- DANH MỤC -->
        <td>
          <span class="badge-category badge-cat-${escapeHtml(p.categoryId)}">
            <span>${catIcon}</span>
            <span>${catName}</span>
          </span>
        </td>

        <!-- HÃNG -->
        <td>
          <strong style="color: #334155;">${escapeHtml(p.brand || 'Khác')}</strong>
        </td>

        <!-- GIÁ BÁN -->
        <td style="text-align: right;">
          <span class="price-current">${priceFormatted}</span>
          ${discountPercent > 0 ? `<span style="font-size: 11px; color: #dc2626; font-weight: 700; display: block;">-${discountPercent}%</span>` : ''}
        </td>

        <!-- GIÁ GỐC -->
        <td style="text-align: right;">
          ${originalPriceFormatted ? `<span class="price-original">${originalPriceFormatted}</span>` : '<span style="color: #cbd5e1;">—</span>'}
        </td>

        <!-- TỒN KHO -->
        <td style="text-align: center;">
          <span class="badge-stock ${stockClass}">
            ${stockLabel}
          </span>
        </td>

        <!-- FLASH SALE -->
        <td style="text-align: center;">
          ${p.isFlashSale 
            ? '<span class="badge-flash">⚡ Bật</span>' 
            : '<span style="color: #cbd5e1;">—</span>'}
        </td>

        <!-- THAO TÁC (SỬA & XÓA) -->
        <td style="text-align: center;">
          <div class="table-actions">
            <button 
              type="button" 
              class="btn-action-edit btn-edit-product" 
              data-id="${escapeHtml(p.id)}" 
              title="Chỉnh sửa sản phẩm"
            >
              <span>✏️</span>
              <span>Sửa</span>
            </button>
            <button 
              type="button" 
              class="btn-action-delete btn-delete-product" 
              data-id="${escapeHtml(p.id)}" 
              title="Xóa sản phẩm"
            >
              <span>🗑️</span>
              <span>Xóa</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  renderPagination(totalFiltered);
}

/**
 * Hiển thị các tag bộ lọc đang áp dụng
 */
function renderActiveFilterTags() {
  const container = document.getElementById('activeFilterTags');
  if (!container) return;

  const tags = [];
  if (state.searchTerm) {
    tags.push(`<span class="filter-tag">Từ khóa: "${escapeHtml(state.searchTerm)}"</span>`);
  }
  if (state.selectedCategory !== 'all') {
    const name = CATEGORY_NAMES[state.selectedCategory] || state.selectedCategory;
    tags.push(`<span class="filter-tag">Danh mục: ${name}</span>`);
  }
  if (state.selectedStockFilter !== 'all') {
    const labels = {
      in_stock: 'Còn hàng (>5)',
      low_stock: 'Sắp hết (1-5)',
      out_of_stock: 'Hết hàng (0)'
    };
    tags.push(`<span class="filter-tag">Kho: ${labels[state.selectedStockFilter] || state.selectedStockFilter}</span>`);
  }

  container.innerHTML = tags.join('');
}

/**
 * Render thanh phân trang
 */
function renderPagination(totalItems) {
  const paginationEl = document.getElementById('paginationNumbers');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  if (!paginationEl) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / state.pageSize));

  // Nút Prev / Next
  if (btnPrev) btnPrev.disabled = state.currentPage <= 1;
  if (btnNext) btnNext.disabled = state.currentPage >= totalPages;

  // Tạo các nút số trang
  const buttonsHtml = [];
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === state.currentPage ? 'active' : '';
    buttonsHtml.push(`
      <button type="button" class="btn-page-num ${isActive}" data-page="${i}">
        ${i}
      </button>
    `);
  }
  paginationEl.innerHTML = buttonsHtml.join('');
}

/* ==========================================================================
   7. MODAL THÊM & CHỈNH SỬA SẢN PHẨM (CREATE / UPDATE)
   ========================================================================== */
function openAddModal() {
  state.editingProductId = null;
  const form = document.getElementById('productForm');
  if (form) form.reset();

  document.getElementById('formProductId').value = '';
  document.getElementById('modalTitle').textContent = 'Thêm Sản Phẩm Mới';
  document.getElementById('modalIcon').textContent = '➕';
  document.getElementById('btnSaveText').textContent = 'Lưu Sản Phẩm';

  // Thiết lập mặc định
  document.getElementById('inputProductStock').value = '10';
  document.getElementById('inputProductRating').value = '5.0';
  document.getElementById('inputProductFeatured').checked = true;
  document.getElementById('inputProductFlashSale').checked = false;

  clearValidationErrors();
  updateModalImagePreview();

  const overlay = document.getElementById('productModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function openEditModal(productId) {
  const product = productService.getById(productId);
  if (!product) {
    showToast(`Không tìm thấy sản phẩm có ID: ${productId}`, 'error');
    return;
  }

  state.editingProductId = product.id;
  clearValidationErrors();

  document.getElementById('modalTitle').textContent = `Chỉnh Sửa Sản Phẩm (#${product.id})`;
  document.getElementById('modalIcon').textContent = '✏️';
  document.getElementById('btnSaveText').textContent = 'Cập Nhật Sản Phẩm';

  // Điền dữ liệu cũ vào Form
  document.getElementById('formProductId').value = product.id;
  document.getElementById('inputProductName').value = product.name || '';
  document.getElementById('inputProductCategory').value = product.categoryId || '';
  document.getElementById('inputProductBrand').value = product.brand || '';
  document.getElementById('inputProductPrice').value = product.price || '';
  document.getElementById('inputProductOriginalPrice').value = product.originalPrice || '';
  document.getElementById('inputProductStock').value = product.stock !== undefined ? product.stock : 10;
  document.getElementById('inputProductRating').value = product.rating || 5.0;
  document.getElementById('inputProductImage').value = product.image || '';

  const labels = Array.isArray(product.labels) ? product.labels.join(', ') : (product.labels || '');
  document.getElementById('inputProductLabels').value = labels;

  const specs = Array.isArray(product.specs) ? product.specs.join(', ') : (product.specs || '');
  document.getElementById('inputProductSpecs').value = specs;

  document.getElementById('inputProductDescription').value = product.description || '';
  document.getElementById('inputProductFlashSale').checked = Boolean(product.isFlashSale);
  document.getElementById('inputProductFeatured').checked = Boolean(product.isFeatured);

  updateModalImagePreview();

  const overlay = document.getElementById('productModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeProductModal() {
  const overlay = document.getElementById('productModalOverlay');
  if (overlay) overlay.classList.remove('active');
  clearValidationErrors();
}

/**
 * Cập nhật Live Preview hình ảnh trong modal
 */
function updateModalImagePreview() {
  const imgInput = document.getElementById('inputProductImage');
  const catInput = document.getElementById('inputProductCategory');
  const nameInput = document.getElementById('inputProductName');

  const previewImg = document.getElementById('modalPreviewImg');
  const placeholder = document.getElementById('modalImagePlaceholder');
  const iconEl = document.getElementById('modalPlaceholderIcon');
  const textEl = document.getElementById('modalPlaceholderName');

  const categoryId = catInput ? catInput.value : '';
  const icon = CATEGORY_ICONS[categoryId] || '📦';
  const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Sản phẩm mới';
  const imgUrl = imgInput ? imgInput.value.trim() : '';

  if (iconEl) iconEl.textContent = icon;
  if (textEl) textEl.textContent = name;

  if (imgUrl) {
    if (previewImg) {
      previewImg.src = imgUrl;
      previewImg.style.display = 'block';
      previewImg.onerror = () => {
        previewImg.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      };
      previewImg.onload = () => {
        previewImg.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      };
    }
  } else {
    if (previewImg) previewImg.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

/**
 * Xử lý submit Form thêm / sửa sản phẩm
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('inputProductName').value.trim();
  const categoryId = document.getElementById('inputProductCategory').value;
  const brand = document.getElementById('inputProductBrand').value.trim();
  const priceRaw = document.getElementById('inputProductPrice').value;
  const origPriceRaw = document.getElementById('inputProductOriginalPrice').value;
  const stockRaw = document.getElementById('inputProductStock').value;
  const ratingRaw = document.getElementById('inputProductRating').value;
  const image = document.getElementById('inputProductImage').value.trim();
  const labelsRaw = document.getElementById('inputProductLabels').value;
  const specsRaw = document.getElementById('inputProductSpecs').value;
  const description = document.getElementById('inputProductDescription').value.trim();
  const isFlashSale = document.getElementById('inputProductFlashSale').checked;
  const isFeatured = document.getElementById('inputProductFeatured').checked;

  const productData = {
    name,
    categoryId,
    brand,
    price: priceRaw ? Number(priceRaw) : '',
    originalPrice: origPriceRaw ? Number(origPriceRaw) : null,
    stock: stockRaw !== '' ? Number(stockRaw) : 0,
    rating: ratingRaw ? Number(ratingRaw) : 5.0,
    image,
    labels: labelsRaw ? labelsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    specs: specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    description,
    isFlashSale,
    isFeatured
  };

  // Kiểm tra tính hợp lệ qua validator.js
  const validation = validateProduct(productData);
  displayValidationErrors(validation.errors);

  if (!validation.isValid) {
    showToast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
    // Tự động focus vào trường lỗi đầu tiên
    const firstErrKey = Object.keys(validation.errors)[0];
    const firstInput = document.getElementById(`inputProduct${firstErrKey.charAt(0).toUpperCase() + firstErrKey.slice(1)}`);
    if (firstInput) firstInput.focus();
    return;
  }

  // Thực hiện lưu
  if (state.editingProductId) {
    // UPDATE
    const result = productService.update(state.editingProductId, productData);
    if (result.success) {
      showToast(`Cập nhật sản phẩm "${productData.name}" thành công!`, 'success');
      closeProductModal();
      loadData();
    } else {
      showToast(result.errors?.general || 'Có lỗi xảy ra khi cập nhật.', 'error');
    }
  } else {
    // CREATE
    const result = productService.create(productData);
    if (result.success) {
      showToast(`Thêm mới sản phẩm "${productData.name}" thành công!`, 'success');
      closeProductModal();
      loadData();
    } else {
      showToast('Có lỗi xảy ra khi thêm sản phẩm.', 'error');
    }
  }
}

/**
 * Hiển thị thông báo lỗi inline dưới từng trường input
 */
function displayValidationErrors(errors = {}) {
  const fields = ['name', 'categoryId', 'brand', 'price', 'originalPrice', 'stock', 'image'];

  fields.forEach(field => {
    const inputId = `inputProduct${field.charAt(0).toUpperCase() + field.slice(1)}`;
    const errorEl = document.getElementById(`error_${field}`);
    const inputEl = document.getElementById(inputId);

    if (errors[field]) {
      if (inputEl) inputEl.classList.add('is-error');
      if (errorEl) {
        errorEl.textContent = errors[field];
        errorEl.classList.add('visible');
      }
    } else {
      if (inputEl) inputEl.classList.remove('is-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }
  });
}

function clearValidationErrors() {
  displayValidationErrors({});
}

/* ==========================================================================
   8. MODAL XÁC NHẬN XÓA (DELETE)
   ========================================================================== */
function openDeleteModal(productId) {
  const product = productService.getById(productId);
  if (!product) {
    showToast(`Không tìm thấy sản phẩm ID: ${productId}`, 'error');
    return;
  }

  state.deletingProductId = product.id;

  setElText('deleteProductName', product.name);
  setElText('deleteProductId', `ID: ${product.id}`);
  setElText('deleteProductPrice', formatCurrency(product.price));

  const thumbBox = document.getElementById('deleteProductThumb');
  if (thumbBox) {
    const catIcon = CATEGORY_ICONS[product.categoryId] || '📦';
    if (product.image) {
      thumbBox.innerHTML = `
        <img 
          src="${escapeHtml(product.image)}" 
          alt="${escapeHtml(product.name)}" 
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <span style="display:none;">${catIcon}</span>
      `;
    } else {
      thumbBox.innerHTML = `<span>${catIcon}</span>`;
    }
  }

  const overlay = document.getElementById('deleteModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeDeleteModal() {
  const overlay = document.getElementById('deleteModalOverlay');
  if (overlay) overlay.classList.remove('active');
  state.deletingProductId = null;
}

function confirmDelete() {
  if (!state.deletingProductId) return;

  const product = productService.getById(state.deletingProductId);
  const name = product ? product.name : state.deletingProductId;

  const res = productService.delete(state.deletingProductId);
  if (res.success) {
    showToast(`Đã xóa vĩnh viễn sản phẩm "${name}".`, 'success');
    closeDeleteModal();
    loadData();
  } else {
    showToast(res.message || 'Không thể xóa sản phẩm.', 'error');
  }
}

/* ==========================================================================
   9. MODAL KHÔI PHỤC DỮ LIỆU GỐC (RESET DATA)
   ========================================================================== */
function openResetModal() {
  const overlay = document.getElementById('resetModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeResetModal() {
  const overlay = document.getElementById('resetModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function confirmReset() {
  productService.resetToDefault();
  showToast('Đã khôi phục thành công danh sách 20 sản phẩm mẫu ban đầu!', 'success');
  closeResetModal();

  // Reset bộ lọc về mặc định
  state.searchTerm = '';
  state.selectedCategory = 'all';
  state.selectedStockFilter = 'all';
  state.sortBy = 'newest';
  state.currentPage = 1;

  const searchInput = document.getElementById('adminSearchInput');
  const catSelect = document.getElementById('adminCategoryFilter');
  const stockSelect = document.getElementById('adminStockFilter');
  const sortSelect = document.getElementById('adminSortBy');
  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'all';
  if (stockSelect) stockSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';

  loadData();
}

/* ==========================================================================
   10. ĐĂNG KÝ SỰ KIỆN TƯƠNG TÁC (EVENT LISTENERS)
   ========================================================================== */
function setupEventListeners() {
  // 1. Sidebar Toggle & Mobile
  const btnToggle = document.getElementById('btnSidebarToggle');
  const btnClose = document.getElementById('btnSidebarClose');
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (btnToggle && sidebar) {
    btnToggle.addEventListener('click', () => sidebar.classList.add('open'));
  }
  if (btnClose && sidebar) {
    btnClose.addEventListener('click', () => sidebar.classList.remove('open'));
  }
  if (backdrop && sidebar) {
    backdrop.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // 2. Tìm kiếm (Input real-time có debounce nhẹ)
  const searchInput = document.getElementById('adminSearchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      const val = e.target.value;
      if (btnClearSearch) btnClearSearch.style.display = val ? 'block' : 'none';

      timeout = setTimeout(() => {
        state.searchTerm = val;
        state.currentPage = 1;
        applyFiltersAndSort();
        renderTable();
      }, 200);
    });
  }

  if (btnClearSearch && searchInput) {
    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      btnClearSearch.style.display = 'none';
      state.searchTerm = '';
      state.currentPage = 1;
      applyFiltersAndSort();
      renderTable();
      searchInput.focus();
    });
  }

  // 3. Bộ lọc Danh mục
  const catSelect = document.getElementById('adminCategoryFilter');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      state.currentPage = 1;
      applyFiltersAndSort();
      renderTable();
    });
  }

  // 4. Bộ lọc Tồn kho
  const stockSelect = document.getElementById('adminStockFilter');
  if (stockSelect) {
    stockSelect.addEventListener('change', (e) => {
      state.selectedStockFilter = e.target.value;
      state.currentPage = 1;
      applyFiltersAndSort();
      renderTable();
    });
  }

  // 5. Sắp xếp
  const sortSelect = document.getElementById('adminSortBy');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndSort();
      renderTable();
    });
  }

  // 6. Số lượng hiển thị mỗi trang
  const pageSizeSelect = document.getElementById('adminPageSize');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      state.pageSize = Number(e.target.value);
      state.currentPage = 1;
      applyFiltersAndSort();
      renderTable();
    });
  }

  // 7. Đặt lại bộ lọc (Reset Filters button)
  const btnResetFilters = document.getElementById('btnResetFilters');
  const btnEmptyResetFilter = document.getElementById('btnEmptyResetFilter');
  const resetFiltersFn = () => {
    state.searchTerm = '';
    state.selectedCategory = 'all';
    state.selectedStockFilter = 'all';
    state.sortBy = 'newest';
    state.currentPage = 1;

    if (searchInput) searchInput.value = '';
    if (btnClearSearch) btnClearSearch.style.display = 'none';
    if (catSelect) catSelect.value = 'all';
    if (stockSelect) stockSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'newest';

    applyFiltersAndSort();
    renderTable();
  };

  if (btnResetFilters) btnResetFilters.addEventListener('click', resetFiltersFn);
  if (btnEmptyResetFilter) btnEmptyResetFilter.addEventListener('click', resetFiltersFn);

  // 8. Chuyển trang (Pagination clicks via delegation)
  const paginationEl = document.getElementById('paginationNumbers');
  if (paginationEl) {
    paginationEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-page-num');
      if (!btn) return;
      const page = Number(btn.getAttribute('data-page'));
      if (page && page !== state.currentPage) {
        state.currentPage = page;
        renderTable();
      }
    });
  }

  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderTable();
      }
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const totalPages = Math.ceil(state.filteredProducts.length / state.pageSize);
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderTable();
      }
    });
  }

  // 9. Nút Mở Modal Thêm Sản Phẩm (Topbar, Sidebar, Section)
  const btnTopAdd = document.getElementById('btnTopAddProduct');
  const btnSectionAdd = document.getElementById('btnSectionAddProduct');
  const navAdd = document.getElementById('navLinkAddProduct');

  if (btnTopAdd) btnTopAdd.addEventListener('click', openAddModal);
  if (btnSectionAdd) btnSectionAdd.addEventListener('click', openAddModal);
  if (navAdd) navAdd.addEventListener('click', openAddModal);

  // 10. Đóng Modal Thêm / Sửa
  const btnCloseModal = document.getElementById('btnCloseProductModal');
  const btnCancelModal = document.getElementById('btnCancelProductModal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeProductModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeProductModal);

  // 11. Submit Form Sản Phẩm
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', handleFormSubmit);
  }

  // 12. Live Preview Hình ảnh khi gõ hoặc đổi danh mục
  const imgInput = document.getElementById('inputProductImage');
  const catInput = document.getElementById('inputProductCategory');
  const nameInput = document.getElementById('inputProductName');
  const btnRefreshPreview = document.getElementById('btnRefreshPreview');

  if (imgInput) imgInput.addEventListener('input', updateModalImagePreview);
  if (catInput) catInput.addEventListener('change', updateModalImagePreview);
  if (nameInput) nameInput.addEventListener('input', updateModalImagePreview);
  if (btnRefreshPreview) btnRefreshPreview.addEventListener('click', updateModalImagePreview);

  // 13. Thao tác trên bảng (Sửa & Xóa qua Event Delegation)
  const tableBody = document.getElementById('adminProductTableBody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-product');
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        openEditModal(id);
        return;
      }

      const delBtn = e.target.closest('.btn-delete-product');
      if (delBtn) {
        const id = delBtn.getAttribute('data-id');
        openDeleteModal(id);
        return;
      }
    });
  }

  // 14. Modal Xóa (Xác nhận & Hủy)
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', closeDeleteModal);
  if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', confirmDelete);

  // 15. Modal Reset Data (Xác nhận & Hủy)
  const btnTopReset = document.getElementById('btnTopResetData');
  const navReset = document.getElementById('navLinkResetData');
  const btnCancelReset = document.getElementById('btnCancelReset');
  const btnConfirmReset = document.getElementById('btnConfirmReset');

  if (btnTopReset) btnTopReset.addEventListener('click', openResetModal);
  if (navReset) navReset.addEventListener('click', openResetModal);
  if (btnCancelReset) btnCancelReset.addEventListener('click', closeResetModal);
  if (btnConfirmReset) btnConfirmReset.addEventListener('click', confirmReset);

  // 16. Click ra ngoài backdrop để đóng modal
  const modals = [
    { overlay: document.getElementById('productModalOverlay'), closeFn: closeProductModal },
    { overlay: document.getElementById('deleteModalOverlay'), closeFn: closeDeleteModal },
    { overlay: document.getElementById('resetModalOverlay'), closeFn: closeResetModal }
  ];

  modals.forEach(({ overlay, closeFn }) => {
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeFn();
      });
    }
  });

  // 17. Phím Escape để đóng modal đang mở
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeDeleteModal();
      closeResetModal();
    }
  });

  // 18. Sidebar Nav Links active toggle
  const navDashboard = document.getElementById('navLinkDashboard');
  const navProducts = document.getElementById('navLinkProducts');
  const navItemDash = document.getElementById('navItemDashboard');
  const navItemProd = document.getElementById('navItemProducts');

  if (navDashboard && navItemDash) {
    navDashboard.addEventListener('click', () => {
      navItemDash.classList.add('active');
      if (navItemProd) navItemProd.classList.remove('active');
      const section = document.getElementById('sectionStats');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (navProducts && navItemProd) {
    navProducts.addEventListener('click', () => {
      navItemProd.classList.add('active');
      if (navItemDash) navItemDash.classList.remove('active');
      const section = document.getElementById('sectionProducts');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// Tự động khởi chạy khi trang hoàn tất nạp DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
  initAdminPage();
}
