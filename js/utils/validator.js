/**
 * validator.js - Các hàm kiểm tra tính hợp lệ dữ liệu đầu vào (Validation)
 */

/**
 * Kiểm tra giá trị bắt buộc (không được rỗng hoặc chỉ toàn khoảng trắng)
 * @param {*} value 
 * @param {string} fieldName 
 * @returns {string|null} Trả về thông báo lỗi hoặc null nếu hợp lệ
 */
export function isRequired(value, fieldName = 'Trường này') {
  if (value === undefined || value === null) {
    return `${fieldName} không được để trống.`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} không được để trống.`;
  }
  return null;
}

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ (10 chữ số, đầu số 03, 05, 07, 08, 09)
 * @param {string} phone 
 * @returns {string|null}
 */
export function isPhoneVN(phone) {
  const emptyErr = isRequired(phone, 'Số điện thoại');
  if (emptyErr) return emptyErr;

  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  const cleanPhone = String(phone).trim().replace(/\s|\./g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return 'Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
  }
  return null;
}

/**
 * Kiểm tra định dạng Email
 * @param {string} email 
 * @returns {string|null}
 */
export function isEmail(email) {
  if (!email || email.trim() === '') return null; // Email có thể là tùy chọn
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Email không đúng định dạng.';
  }
  return null;
}

/**
 * Kiểm tra số dương hợp lệ (giá tiền, số lượng)
 * @param {*} value 
 * @param {string} fieldName 
 * @param {boolean} allowZero 
 * @returns {string|null}
 */
export function isPositiveNumber(value, fieldName = 'Giá trị', allowZero = false) {
  const emptyErr = isRequired(value, fieldName);
  if (emptyErr) return emptyErr;

  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} phải là một số hợp lệ.`;
  }
  if (allowZero ? num < 0 : num <= 0) {
    return `${fieldName} phải lớn hơn ${allowZero ? 'hoặc bằng 0' : '0'}.`;
  }
  return null;
}

/**
 * Kiểm tra số nguyên không âm
 * @param {*} value 
 * @param {string} fieldName 
 * @returns {string|null}
 */
export function isInteger(value, fieldName = 'Số lượng') {
  const emptyErr = isRequired(value, fieldName);
  if (emptyErr) return emptyErr;

  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return `${fieldName} phải là số nguyên không âm.`;
  }
  return null;
}

/**
 * Kiểm tra toàn diện thông tin sản phẩm (Dùng cho Admin CRUD Thêm/Sửa)
 * @param {Object} productData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateProduct(productData) {
  const errors = {};

  // Tên sản phẩm
  const nameErr = isRequired(productData.name, 'Tên sản phẩm');
  if (nameErr) {
    errors.name = nameErr;
  } else if (productData.name.trim().length < 3) {
    errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự.';
  }

  // Danh mục
  const catErr = isRequired(productData.categoryId, 'Danh mục sản phẩm');
  if (catErr) errors.categoryId = catErr;

  // Thương hiệu / Hãng
  const brandErr = isRequired(productData.brand, 'Thương hiệu/Hãng');
  if (brandErr) errors.brand = brandErr;

  // Giá bán hiện tại
  const priceErr = isPositiveNumber(productData.price, 'Giá bán');
  if (priceErr) errors.price = priceErr;

  // Giá gốc (nếu có thì phải >= giá bán)
  if (productData.originalPrice) {
    const origPriceErr = isPositiveNumber(productData.originalPrice, 'Giá gốc');
    if (origPriceErr) {
      errors.originalPrice = origPriceErr;
    } else if (Number(productData.originalPrice) < Number(productData.price)) {
      errors.originalPrice = 'Giá gốc không được nhỏ hơn giá bán khuyến mãi.';
    }
  }

  // Số lượng tồn kho
  const stockErr = isInteger(productData.stock ?? 0, 'Số lượng tồn kho');
  if (stockErr) errors.stock = stockErr;

  // Hình ảnh đại diện
  const imgErr = isRequired(productData.image, 'Ảnh sản phẩm');
  if (imgErr) errors.image = imgErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Kiểm tra dữ liệu đơn hàng (Dùng cho trang Giỏ hàng & Checkout)
 * @param {Object} orderData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateOrder(orderData) {
  const errors = {};

  // Họ tên
  const nameErr = isRequired(orderData.fullName, 'Họ và tên');
  if (nameErr) {
    errors.fullName = nameErr;
  } else if (orderData.fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
  }

  // Số điện thoại
  const phoneErr = isPhoneVN(orderData.phone);
  if (phoneErr) errors.phone = phoneErr;

  // Địa chỉ
  const addressErr = isRequired(orderData.address, 'Địa chỉ nhận hàng');
  if (addressErr) {
    errors.address = addressErr;
  } else if (orderData.address.trim().length < 5) {
    errors.address = 'Vui lòng nhập địa chỉ cụ thể hơn (tối thiểu 5 ký tự).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
