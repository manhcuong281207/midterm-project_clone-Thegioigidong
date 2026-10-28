/**
 * productPage.js - Xử lý logic Trang Danh Sách Sản Phẩm, Bộ Lọc & Tìm Kiếm
 * Đọc tham số URL, lọc đa tiêu chí, sắp xếp động và xử lý trường hợp rỗng
 */

import { initHeader } from '../components/header.js';
import { initFooter } from '../components/footer.js';
import { createProductCardHTML, bindProductCardEvents } from '../components/productCard.js';
import { productService } from '../services/productService.js';
import { CATEGORIES } from '../data/defaultProducts.js';

// State quản lý bộ lọc hiện tại của trang
const state = {
  category: 'all',
  brand: 'all',
  priceRange: 'all',
  isFlashSale: null,
  sortBy: 'sold-desc',
  searchKeyword: ''
};

const PRICE_RANGES = {
  'under-5m': { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  '5m-10m': { label: 'Từ 5 - 10 triệu', min: 5000000, max: 10000000 },
  '10m-20m': { label: 'Từ 10 - 20 triệu', min: 10000000, max: 20000000 },
  'above-20m': { label: 'Trên 20 triệu', min: 20000000, max: 999999999 }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Header và Footer
  initHeader('header-container');
  initFooter('footer-container');

  // 2. Đọc các tham số từ URL
  readUrlParams();

  // 3. Render các nút bấm của Bộ lọc (Danh mục, Hãng, Mức giá)
  renderFilterControls();

  // 4. Lắng nghe các sự kiện Sắp xếp và Bộ lọc
  bindFilterEvents();

  // 5. Áp dụng lọc và hiển thị danh sách sản phẩm
  applyFiltersAndRender();
});

/**
 * Đọc các tham số tìm kiếm, danh mục, hãng từ URL query
 */
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('category')) {
    state.category = params.get('category') || 'all';
  }
  if (params.has('search')) {
    state.searchKeyword = params.get('search') || '';
  }
  if (params.has('brand')) {
    state.brand = params.get('brand') || 'all';
  }
  if (params.has('price')) {
    state.priceRange = params.get('price') || 'all';
  }
  if (params.has('sale') && params.get('sale') === 'true') {
    state.isFlashSale = true;
  }
  if (params.has('sort')) {
    state.sortBy = params.get('sort') || 'sold-desc';
  }
}

/**
 * Cập nhật URL trình duyệt (không tải lại trang) để có thể bookmark/chia sẻ
 */
function updateUrlParams() {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  if (state.searchKeyword) params.set('search', state.searchKeyword);
  if (state.brand !== 'all') params.set('brand', state.brand);
  if (state.priceRange !== 'all') params.set('price', state.priceRange);
  if (state.isFlashSale === true) params.set('sale', 'true');
  if (state.sortBy !== 'sold-desc') params.set('sort', state.sortBy);

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Render các nút lựa chọn của Bộ lọc
 */
function renderFilterControls() {
  // 1. Danh mục
  const catContainer = document.getElementById('filterCategories');
  if (catContainer) {
    const allCats = [{ id: 'all', name: 'Tất cả' }, ...CATEGORIES];
    catContainer.innerHTML = allCats.map(c => `
      <button type="button" class="filter-btn ${state.category === c.id ? 'active' : ''}" data-type="category" data-val="${c.id}">
        ${c.name}
      </button>
    `).join('');
  }

  // 2. Thương hiệu (Hãng sản xuất) - cập nhật linh hoạt theo danh mục đang chọn
  updateBrandFilters();

  // 3. Mức giá
  const priceContainer = document.getElementById('filterPrices');
  if (priceContainer) {
    priceContainer.innerHTML = `
      <button type="button" class="filter-btn ${state.priceRange === 'all' ? 'active' : ''}" data-type="price" data-val="all">Tất cả mức giá</button>
      <button type="button" class="filter-btn ${state.priceRange === 'under-5m' ? 'active' : ''}" data-type="price" data-val="under-5m">Dưới 5 triệu</button>
      <button type="button" class="filter-btn ${state.priceRange === '5m-10m' ? 'active' : ''}" data-type="price" data-val="5m-10m">5 - 10 triệu</button>
      <button type="button" class="filter-btn ${state.priceRange === '10m-20m' ? 'active' : ''}" data-type="price" data-val="10m-20m">10 - 20 triệu</button>
      <button type="button" class="filter-btn ${state.priceRange === 'above-20m' ? 'active' : ''}" data-type="price" data-val="above-20m">Trên 20 triệu</button>
    `;
  }

  // 4. Ưu đãi đặc biệt
  const specialBtn = document.getElementById('filterSpecialFlashSale');
  if (specialBtn) {
    specialBtn.classList.toggle('active', state.isFlashSale === true);
  }

  // 5. Cập nhật nút sort active
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === state.sortBy);
  });
}

/**
 * Cập nhật danh sách nút Brand theo Category hiện tại
 */
function updateBrandFilters() {
  const brandContainer = document.getElementById('filterBrands');
  if (!brandContainer) return;

  const brands = productService.getBrands(state.category !== 'all' ? state.category : null);
  brandContainer.innerHTML = `
    <button type="button" class="filter-btn ${state.brand === 'all' ? 'active' : ''}" data-type="brand" data-val="all">
      Tất cả hãng
    </button>
    ${brands.map(b => `
      <button type="button" class="filter-btn ${state.brand.toLowerCase() === b.toLowerCase() ? 'active' : ''}" data-type="brand" data-val="${b}">
        ${b}
      </button>
    `).join('')}
  `;
}

/**
 * Gắn các sự kiện click bộ lọc và sắp xếp
 */
function bindFilterEvents() {
  // Lắng nghe click các nút filter
  const filterBox = document.getElementById('filterBox');
  if (filterBox) {
    filterBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const type = btn.dataset.type;
      const val = btn.dataset.val;

      if (type === 'category') {
        state.category = val;
        state.brand = 'all'; // Reset brand khi đổi category
        updateBrandFilters();
      } else if (type === 'brand') {
        state.brand = val;
      } else if (type === 'price') {
        state.priceRange = val;
      }

      renderFilterControls();
      applyFiltersAndRender();
      updateUrlParams();
    });
  }

  // Nút lọc Flash Sale
  const specialBtn = document.getElementById('filterSpecialFlashSale');
  if (specialBtn) {
    specialBtn.addEventListener('click', () => {
      state.isFlashSale = state.isFlashSale ? null : true;
      specialBtn.classList.toggle('active', state.isFlashSale === true);
      applyFiltersAndRender();
      updateUrlParams();
    });
  }

  // Thanh sắp xếp
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sortBy = btn.dataset.sort;
      applyFiltersAndRender();
      updateUrlParams();
    });
  });

  // Nút xóa tất cả bộ lọc
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-clear-all-filters') || e.target.closest('.btn-reset-filters')) {
      resetAllFilters();
    }
  });
}

function resetAllFilters() {
  state.category = 'all';
  state.brand = 'all';
  state.priceRange = 'all';
  state.isFlashSale = null;
  state.searchKeyword = '';
  state.sortBy = 'sold-desc';

  renderFilterControls();
  applyFiltersAndRender();
  updateUrlParams();
}

/**
 * Thực hiện logic truy vấn dữ liệu và render giao diện
 */
function applyFiltersAndRender() {
  const grid = document.getElementById('catalogProductGrid');
  const emptyState = document.getElementById('catalogEmptyState');
  const countBadge = document.getElementById('catalogCountBadge');
  const pageTitle = document.getElementById('catalogTitle');
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  const activeFiltersBar = document.getElementById('activeFiltersBar');
  const activeTagsContainer = document.getElementById('activeTagsContainer');

  if (!grid) return;

  // 1. Tìm kiếm (nếu có keyword)
  let products = productService.getAll();
  if (state.searchKeyword) {
    products = productService.search(state.searchKeyword, products);
  }

  // 2. Lọc đa tiêu chí
  const criteria = {};
  if (state.category !== 'all') criteria.categoryId = state.category;
  if (state.brand !== 'all') criteria.brand = state.brand;
  if (state.isFlashSale !== null) criteria.isFlashSale = state.isFlashSale;

  if (state.priceRange !== 'all' && PRICE_RANGES[state.priceRange]) {
    criteria.minPrice = PRICE_RANGES[state.priceRange].min;
    criteria.maxPrice = PRICE_RANGES[state.priceRange].max;
  }

  products = productService.filter(products, criteria);

  // 3. Sắp xếp
  products = productService.sort(products, state.sortBy);

  // 4. Cập nhật Tiêu đề trang & Breadcrumb
  let titleText = 'Tất cả sản phẩm';
  if (state.searchKeyword) {
    titleText = `Kết quả tìm kiếm cho "${state.searchKeyword}"`;
  } else if (state.category !== 'all') {
    const matchedCat = CATEGORIES.find(c => c.id === state.category);
    titleText = matchedCat ? `${matchedCat.name} chính hãng` : 'Sản phẩm';
  }
  if (pageTitle) pageTitle.textContent = titleText;
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = titleText;
  if (countBadge) countBadge.textContent = `(${products.length} sản phẩm)`;

  // 5. Render Dải Tag đang lọc
  renderActiveFilterTags(activeFiltersBar, activeTagsContainer);

  // 6. Hiển thị Lưới sản phẩm hoặc Empty State
  if (products.length === 0) {
    grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = products.map(p => createProductCardHTML(p)).join('');
    bindProductCardEvents(grid);
  }
}

/**
 * Render dải tag hiển thị các bộ lọc đang kích hoạt
 */
function renderActiveFilterTags(bar, container) {
  if (!bar || !container) return;

  const tags = [];

  if (state.searchKeyword) {
    tags.push({ label: `Tìm: "${state.searchKeyword}"`, key: 'search' });
  }
  if (state.category !== 'all') {
    const cat = CATEGORIES.find(c => c.id === state.category);
    tags.push({ label: `Danh mục: ${cat ? cat.name : state.category}`, key: 'category' });
  }
  if (state.brand !== 'all') {
    tags.push({ label: `Hãng: ${state.brand}`, key: 'brand' });
  }
  if (state.priceRange !== 'all' && PRICE_RANGES[state.priceRange]) {
    tags.push({ label: `Giá: ${PRICE_RANGES[state.priceRange].label}`, key: 'price' });
  }
  if (state.isFlashSale === true) {
    tags.push({ label: 'Khuyến mãi Flash Sale', key: 'sale' });
  }

  if (tags.length === 0) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  container.innerHTML = tags.map(t => `
    <span class="active-filter-tag">
      <span>${t.label}</span>
      <button type="button" class="js-remove-tag" data-key="${t.key}" title="Bỏ lọc">&times;</button>
    </span>
  `).join('');

  // Gắn sự kiện xóa từng tag
  container.querySelectorAll('.js-remove-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (key === 'search') state.searchKeyword = '';
      if (key === 'category') { state.category = 'all'; state.brand = 'all'; }
      if (key === 'brand') state.brand = 'all';
      if (key === 'price') state.priceRange = 'all';
      if (key === 'sale') state.isFlashSale = null;

      renderFilterControls();
      applyFiltersAndRender();
      updateUrlParams();
    });
  });
}
