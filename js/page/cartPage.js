/**
 * cartPage.js - Xử lý logic Trang Giỏ Hàng & Thanh Toán
 * Quản lý: Render giỏ hàng, tăng/giảm số lượng, xóa sản phẩm, tính tiền và Validate form đặt hàng
 */

import { initHeader } from '../components/header.js';
import { initFooter } from '../components/footer.js';
import { cartService } from '../services/cartService.js';
import { formatCurrency } from '../utils/format.js';
import { validateOrder, isPhoneVN } from '../utils/validator.js';

const CATEGORY_ICONS = {
  phone: '📱', laptop: '💻', tablet: '📟', watch: '⌚', accessory: '🎧'
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader('header-container');
  initFooter('footer-container');

  // Render giỏ hàng lần đầu
  renderCart();

  // Lắng nghe thay đổi giỏ hàng từ trang khác (nếu mở nhiều tab)
  cartService.onCartChange(() => renderCart());
});

/* ==========================================================================
   RENDER GIỎ HÀNG CHÍNH
   ========================================================================== */
function renderCart() {
  const cart = cartService.getCart();
  const cartSection = document.getElementById('cartSection');
  const emptySection = document.getElementById('cartEmptySection');
  const checkoutSection = document.getElementById('checkoutSection');

  if (cart.length === 0) {
    if (cartSection) cartSection.style.display = 'none';
    if (checkoutSection) checkoutSection.style.display = 'none';
    if (emptySection) emptySection.style.display = 'block';
    return;
  }

  if (cartSection) cartSection.style.display = 'block';
  if (checkoutSection) checkoutSection.style.display = 'block';
  if (emptySection) emptySection.style.display = 'none';

  renderCartItems(cart);
  renderCartSummary(cart);
}

/* Render danh sách sản phẩm trong giỏ */
function renderCartItems(cart) {
  const listEl = document.getElementById('cartItemsList');
  const countTag = document.getElementById('cartCountTag');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countTag) countTag.textContent = totalCount;

  if (!listEl) return;

  listEl.innerHTML = cart.map((item, index) => {
    const p = item.product;
    const icon = CATEGORY_ICONS[p.categoryId] || '📦';
    const hasImg = Boolean(p.image && p.image.trim());
    const subtotal = p.price * item.quantity;

    const specParts = [];
    if (item.selectedSpecs?.version) specParts.push(item.selectedSpecs.version);
    if (item.selectedSpecs?.color) specParts.push(item.selectedSpecs.color);

    return `
      <div class="cart-item-row" data-index="${index}" data-id="${p.id}">
        <!-- Ảnh thumbnail có Fallback -->
        <a href="product-detail.html?id=${p.id}">
          <div class="cart-item-img-box">
            <div class="cart-item-placeholder" id="cartImgFb_${index}">${icon}</div>
            ${hasImg ? `
              <img src="${p.image}" alt="${p.name}" class="cart-item-img"
                onerror="this.style.display='none'; document.getElementById('cartImgFb_${index}').style.display='flex';" />
            ` : ''}
          </div>
        </a>

        <!-- Tên & Cấu hình -->
        <div class="cart-item-info">
          <a href="product-detail.html?id=${p.id}" class="cart-item-name" title="${p.name}">
            ${p.name}
          </a>
          ${specParts.length > 0 ? `
            <div class="cart-item-specs">
              ${specParts.map(s => `<span class="cart-item-spec-chip">${s}</span>`).join('')}
            </div>
          ` : ''}
          <!-- Hiển thị đơn giá trên mobile (ẩn trên desktop vì có cột riêng) -->
          <div style="font-size: 12px; color: var(--color-price); font-weight: 700; margin-top: 6px;">
            ${formatCurrency(p.price)} / cái
          </div>
        </div>

        <!-- Đơn giá (Desktop) -->
        <div class="cart-item-unit-price">${formatCurrency(p.price)}</div>

        <!-- Bộ điều khiển số lượng -->
        <div class="cart-qty-ctrl">
          <button type="button" class="btn-cart-qty js-qty-minus" data-id="${p.id}" data-index="${index}" aria-label="Giảm">−</button>
          <input type="number" class="cart-qty-val" value="${item.quantity}" min="1" max="${p.stock || 99}" data-id="${p.id}" data-index="${index}" readonly />
          <button type="button" class="btn-cart-qty js-qty-plus" data-id="${p.id}" data-index="${index}" aria-label="Tăng">+</button>
        </div>

        <!-- Thành tiền -->
        <div class="cart-item-subtotal">${formatCurrency(subtotal)}</div>

        <!-- Nút xóa -->
        <button type="button" class="btn-remove-item js-remove-item" data-id="${p.id}" data-index="${index}" title="Xóa khỏi giỏ hàng">
          &times;
        </button>
      </div>
    `;
  }).join('');

  // Gắn sự kiện sau khi render
  bindCartItemEvents();
}

/* Render bảng Tổng kết đơn hàng */
function renderCartSummary(cart) {
  const subtotalEl = document.getElementById('summarySubtotal');
  const shippingEl = document.getElementById('summaryShipping');
  const totalEl = document.getElementById('summaryTotal');
  const proceedBtn = document.getElementById('btnProceedToCheckout');

  const subtotal = cartService.getCartTotal();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatCurrency(shipping);
  if (totalEl) totalEl.textContent = formatCurrency(total);
  if (proceedBtn) proceedBtn.disabled = cart.length === 0;
}

/* Gắn sự kiện tăng/giảm số lượng và xóa sản phẩm */
function bindCartItemEvents() {
  // Nút giảm số lượng
  document.querySelectorAll('.js-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const cart = cartService.getCart();
      const item = cart.find(i => i.product.id === productId);
      if (!item) return;

      if (item.quantity <= 1) {
        confirmRemoveItem(productId, btn.closest('.cart-item-row')?.querySelector('.cart-item-name')?.textContent?.trim() || 'sản phẩm này');
      } else {
        cartService.updateQuantity(productId, item.quantity - 1);
        renderCart();
      }
    });
  });

  // Nút tăng số lượng
  document.querySelectorAll('.js-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const cart = cartService.getCart();
      const item = cart.find(i => i.product.id === productId);
      if (!item) return;
      const maxStock = item.product.stock || 99;
      if (item.quantity >= maxStock) return;
      cartService.updateQuantity(productId, item.quantity + 1);
      renderCart();
    });
  });

  // Nút xóa từng sản phẩm
  document.querySelectorAll('.js-remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const name = btn.closest('.cart-item-row')?.querySelector('.cart-item-name')?.textContent?.trim() || 'sản phẩm này';
      confirmRemoveItem(productId, name);
    });
  });

  // Nút xóa toàn bộ giỏ hàng
  const btnClearCart = document.getElementById('btnClearCart');
  if (btnClearCart) {
    btnClearCart.onclick = () => {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        cartService.clearCart();
        renderCart();
      }
    };
  }
}

/* Hộp thoại xác nhận xóa sản phẩm */
function confirmRemoveItem(productId, productName) {
  if (confirm(`Bạn muốn xóa "${productName}" khỏi giỏ hàng?`)) {
    cartService.removeFromCart(productId);
    renderCart();
  }
}

/* Nút "Tiến hành đặt hàng" cuộn xuống form */
const proceedBtn = document.getElementById('btnProceedToCheckout');
if (proceedBtn) {
  proceedBtn.addEventListener('click', () => {
    const form = document.getElementById('checkoutForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ==========================================================================
   VALIDATE FORM ĐẶT HÀNG
   ========================================================================== */

/* Hiển thị lỗi dưới từng trường input */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(`${inputId}Error`);
  if (input) { input.classList.add('is-error'); input.classList.remove('is-valid'); }
  if (errEl) { errEl.textContent = `⚠ ${message}`; errEl.classList.add('show'); }
}

/* Xóa lỗi & đánh dấu hợp lệ */
function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(`${inputId}Error`);
  if (input) { input.classList.remove('is-error'); input.classList.add('is-valid'); }
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
}

/* Xóa tất cả validation state */
function resetAllValidation() {
  ['fullName', 'phone', 'address'].forEach(id => {
    const input = document.getElementById(id);
    const errEl = document.getElementById(`${id}Error`);
    if (input) { input.classList.remove('is-error', 'is-valid'); }
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  });
}

/* Validate realtime khi người dùng rời khỏi trường (blur) */
document.addEventListener('DOMContentLoaded', () => {
  // Validate họ tên
  document.getElementById('fullName')?.addEventListener('blur', (e) => {
    const val = e.target.value.trim();
    if (!val) showFieldError('fullName', 'Họ và tên không được để trống.');
    else if (val.length < 2) showFieldError('fullName', 'Họ và tên phải có ít nhất 2 ký tự.');
    else clearFieldError('fullName');
  });

  // Validate số điện thoại
  document.getElementById('phone')?.addEventListener('blur', (e) => {
    const err = isPhoneVN(e.target.value);
    if (err) showFieldError('phone', err);
    else clearFieldError('phone');
  });

  // Validate địa chỉ
  document.getElementById('address')?.addEventListener('blur', (e) => {
    const val = e.target.value.trim();
    if (!val) showFieldError('address', 'Địa chỉ nhận hàng không được để trống.');
    else if (val.length < 5) showFieldError('address', 'Vui lòng nhập địa chỉ cụ thể hơn (ít nhất 5 ký tự).');
    else clearFieldError('address');
  });

  // Form submit
  document.getElementById('checkoutForm')?.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(e) {
  e.preventDefault();
  resetAllValidation();

  const cart = cartService.getCart();
  if (cart.length === 0) {
    alert('Giỏ hàng của bạn đang trống!');
    return;
  }

  const formData = {
    fullName: document.getElementById('fullName')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    address: document.getElementById('address')?.value.trim(),
    note: document.getElementById('orderNote')?.value.trim() || ''
  };

  const { isValid, errors } = validateOrder(formData);

  if (!isValid) {
    // Hiển thị lỗi bên dưới từng ô nhập liệu tương ứng
    Object.entries(errors).forEach(([field, msg]) => {
      showFieldError(field, msg);
    });
    // Cuộn lên trường đầu tiên bị lỗi
    const firstErrorId = Object.keys(errors)[0];
    document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Tất cả hợp lệ → Hiển thị modal xác nhận thành công
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';
  placeOrder(formData, paymentMethod);
}

/* ==========================================================================
   XỬ LÝ ĐẶT HÀNG & HIỂN THỊ MODAL THÀNH CÔNG
   ========================================================================== */
function placeOrder(formData, paymentMethod) {
  // Sinh mã đơn hàng ngẫu nhiên
  const orderCode = 'ORD-' + Date.now().toString(36).toUpperCase().slice(-6);

  // Xóa giỏ hàng
  cartService.clearCart();

  // Hiển thị modal thành công
  const overlay = document.getElementById('orderSuccessOverlay');
  const codeEl = document.getElementById('orderCode');
  const buyerNameEl = document.getElementById('orderBuyerName');

  if (codeEl) codeEl.textContent = orderCode;
  if (buyerNameEl) buyerNameEl.textContent = formData.fullName;
  if (overlay) {
    overlay.classList.add('show');

    // Nút về trang chủ
    document.getElementById('btnOrderGoHome')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    // Nút tiếp tục mua sắm
    document.getElementById('btnOrderContinue')?.addEventListener('click', () => {
      window.location.href = 'product.html';
    });
  }
}
