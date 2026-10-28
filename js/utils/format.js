/**
 * format.js - Các hàm định dạng dữ liệu (tiền tệ, ngày tháng, chuỗi)
 */

/**
 * Định dạng tiền tệ Việt Nam Đồng (VND) theo chuẩn UI_DESIGN_GUIDELINES: Intl.NumberFormat('vi-VN') + '₫'
 * @param {number|string} amount 
 * @returns {string} ví dụ: 29990000 => "29.990.000₫"
 */
export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(num) + '₫';
}

/**
 * Tính phần trăm giảm giá giữa giá bán và giá gốc
 * @param {number} price 
 * @param {number} originalPrice 
 * @returns {number} phần trăm giảm (ví dụ: 15 nghĩa là -15%)
 */
export function calculateDiscountPercent(price, originalPrice) {
  const p = Number(price);
  const op = Number(originalPrice);
  if (!op || op <= p || isNaN(p) || isNaN(op)) return 0;
  return Math.round(((op - p) / op) * 100);
}

/**
 * Xóa dấu tiếng Việt phục vụ tìm kiếm mềm (fuzzy search không dấu)
 * @param {string} str 
 * @returns {string}
 */
export function removeVietnameseTones(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Tạo slug từ tên sản phẩm để làm ID hoặc URL
 * @param {string} str 
 * @returns {string} ví dụ: "iPhone 16 Pro Max" => "iphone-16-pro-max"
 */
export function slugify(str) {
  if (!str) return '';
  return removeVietnameseTones(str)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Định dạng ngày giờ hiển thị kiểu Việt Nam: DD/MM/YYYY HH:mm
 * @param {Date|string|number} dateInput 
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Cắt ngắn văn bản nếu vượt quá độ dài tối đa
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}
