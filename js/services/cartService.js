/**
 * cartService.js - Quản lý nghiệp vụ giỏ hàng (LocalStorage)
 * Tự động đồng bộ giỏ hàng và phát CustomEvent để các component (Header, CartPage) cập nhật tức thì
 */

import { storageService } from './storageService.js';
import { showToast } from '../utils/toast.js';

const STORAGE_KEY = 'TECH_STORE_CART';
const EVENT_NAME = 'techstore:cart-updated';

export const cartService = {
  /**
   * Lấy danh sách sản phẩm trong giỏ hàng
   * @returns {Array<{ product: Object, quantity: number, selectedSpecs: Object }>}
   */
  getCart() {
    return storageService.get(STORAGE_KEY, []);
  },

  /**
   * Lưu giỏ hàng và phát sự kiện đồng bộ
   * @private
   */
  _saveAndNotify(cart) {
    storageService.set(STORAGE_KEY, cart);
    const detail = {
      cart,
      count: this.getCartCount(),
      total: this.getCartTotal()
    };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
    }
    return detail;
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} product - Đối tượng sản phẩm
   * @param {number} [quantity=1] - Số lượng thêm
   * @param {Object} [selectedSpecs={}] - Phiên bản cấu hình chọn (màu, bộ nhớ...)
   * @returns {{ success: boolean, count: number, total: number }}
   */
  addToCart(product, quantity = 1, selectedSpecs = {}) {
    if (!product || !product.id) {
      showToast('Sản phẩm không hợp lệ.', 'error');
      return { success: false };
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const cart = this.getCart();

    // Tìm sản phẩm cùng ID và cùng specs trong giỏ
    const specKey = JSON.stringify(selectedSpecs || {});
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && JSON.stringify(item.selectedSpecs || {}) === specKey
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          brand: product.brand,
          categoryId: product.categoryId,
          stock: product.stock ?? 99
        },
        quantity: qty,
        selectedSpecs: selectedSpecs || {},
        addedAt: new Date().toISOString()
      });
    }

    const result = this._saveAndNotify(cart);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    return { success: true, count: result.count, total: result.total };
  },

  /**
   * Cập nhật số lượng của một món trong giỏ
   * @param {string} productId 
   * @param {number} quantity 
   * @param {Object} [selectedSpecs] 
   */
  updateQuantity(productId, quantity, selectedSpecs = null) {
    const qty = Number(quantity);
    let cart = this.getCart();

    if (qty <= 0) {
      return this.removeFromCart(productId, selectedSpecs);
    }

    const specKey = selectedSpecs ? JSON.stringify(selectedSpecs) : null;
    const target = cart.find(item => {
      const matchId = String(item.product.id) === String(productId);
      if (!matchId) return false;
      if (specKey === null) return true;
      return JSON.stringify(item.selectedSpecs || {}) === specKey;
    });

    if (target) {
      // Giới hạn không vượt quá tồn kho (nếu có thông tin tồn kho)
      const maxStock = target.product.stock || 999;
      target.quantity = Math.min(qty, maxStock);
      this._saveAndNotify(cart);
    }

    return this.getCart();
  },

  /**
   * Xóa một sản phẩm khỏi giỏ hàng
   * @param {string} productId 
   * @param {Object} [selectedSpecs] 
   */
  removeFromCart(productId, selectedSpecs = null) {
    let cart = this.getCart();
    const specKey = selectedSpecs ? JSON.stringify(selectedSpecs) : null;

    cart = cart.filter(item => {
      const matchId = String(item.product.id) === String(productId);
      if (!matchId) return true;
      if (specKey === null) return false;
      return JSON.stringify(item.selectedSpecs || {}) !== specKey;
    });

    this._saveAndNotify(cart);
    showToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
    return cart;
  },

  /**
   * Làm trống toàn bộ giỏ hàng (Sau khi đặt hàng thành công)
   */
  clearCart() {
    this._saveAndNotify([]);
  },

  /**
   * Tính tổng tiền tất cả món trong giỏ hàng
   * @returns {number}
   */
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  /**
   * Tính tổng số lượng sản phẩm (để hiển thị badge ở Header)
   * @returns {number}
   */
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Đăng ký lắng nghe thay đổi giỏ hàng từ bất kỳ đâu trong ứng dụng
   * @param {Function} callback 
   * @returns {Function} Hàm hủy đăng ký (unsubscribe)
   */
  onCartChange(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (event) => callback(event.detail);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }
};
