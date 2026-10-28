/**
 * storageService.js - Quản lý tương tác với LocalStorage an toàn
 */

export const storageService = {
  /**
   * Lấy dữ liệu từ localStorage theo key
   * @param {string} key 
   * @param {*} defaultValue 
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Lỗi đọc localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Lưu dữ liệu vào localStorage
   * @param {string} key 
   * @param {*} value 
   * @returns {boolean} true nếu lưu thành công
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Lỗi ghi localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Xóa một key trong localStorage
   * @param {string} key 
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Lỗi xóa localStorage key "${key}":`, error);
    }
  },

  /**
   * Kiểm tra key có tồn tại trong localStorage không
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      return false;
    }
  },

  /**
   * Xóa toàn bộ dữ liệu localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Lỗi dọn dẹp localStorage:', error);
    }
  }
};
