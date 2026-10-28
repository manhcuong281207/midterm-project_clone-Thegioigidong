/**
 * productService.js - Xử lý toàn bộ nghiệp vụ CRUD và truy vấn dữ liệu sản phẩm
 * Lưu trữ trong LocalStorage thông qua storageService
 */

import { DEFAULT_PRODUCTS, CATEGORIES, BRANDS } from '../data/defaultProducts.js';
import { storageService } from './storageService.js';
import { removeVietnameseTones, slugify, calculateDiscountPercent } from '../utils/format.js';
import { validateProduct } from '../utils/validator.js';

const STORAGE_KEY = 'TECH_STORE_PRODUCTS';

export const productService = {
  /**
   * Khởi tạo dữ liệu: nếu LocalStorage chưa có thì nạp DEFAULT_PRODUCTS
   */
  init() {
    if (!storageService.has(STORAGE_KEY)) {
      storageService.set(STORAGE_KEY, DEFAULT_PRODUCTS);
    }
  },

  /**
   * Lấy toàn bộ danh sách sản phẩm
   * @returns {Array}
   */
  getAll() {
    this.init();
    return storageService.get(STORAGE_KEY, DEFAULT_PRODUCTS);
  },

  /**
   * Lấy thông tin chi tiết một sản phẩm theo ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    if (!id) return null;
    const products = this.getAll();
    return products.find(p => String(p.id).toLowerCase() === String(id).toLowerCase()) || null;
  },

  /**
   * Thêm mới một sản phẩm (Create - Admin)
   * @param {Object} productData 
   * @returns {{ success: boolean, data?: Object, errors?: Object }}
   */
  create(productData) {
    const validation = validateProduct(productData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const products = this.getAll();

    // Tự sinh ID nếu chưa có
    let generatedId = productData.id ? slugify(productData.id) : slugify(productData.name);
    // Tránh trùng ID
    if (products.some(p => p.id === generatedId)) {
      generatedId = `${generatedId}-${Date.now().toString().slice(-4)}`;
    }

    const newProduct = {
      id: generatedId,
      name: productData.name.trim(),
      categoryId: productData.categoryId,
      brand: productData.brand.trim(),
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price),
      image: productData.image.trim(),
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : [productData.image.trim()],
      rating: Number(productData.rating) || 5.0,
      reviewCount: Number(productData.reviewCount) || 0,
      soldCount: Number(productData.soldCount) || 0,
      specs: Array.isArray(productData.specs) ? productData.specs : (productData.specs ? String(productData.specs).split(',').map(s => s.trim()).filter(Boolean) : []),
      labels: Array.isArray(productData.labels) ? productData.labels : (productData.labels ? String(productData.labels).split(',').map(s => s.trim()).filter(Boolean) : []),
      isFlashSale: Boolean(productData.isFlashSale),
      flashSaleProgress: Number(productData.flashSaleProgress) || 0,
      isFeatured: Boolean(productData.isFeatured),
      stock: Number(productData.stock) || 0,
      description: productData.description ? productData.description.trim() : '',
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    storageService.set(STORAGE_KEY, products);

    return { success: true, data: newProduct };
  },

  /**
   * Alias cho create()
   */
  add(productData) {
    return this.create(productData);
  },

  /**
   * Cập nhật thông tin sản phẩm (Update - Admin)
   * @param {string} id 
   * @param {Object} updatedData 
   * @returns {{ success: boolean, data?: Object, errors?: Object }}
   */
  update(id, updatedData) {
    const validation = validateProduct(updatedData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const products = this.getAll();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return { success: false, errors: { general: `Không tìm thấy sản phẩm có ID: ${id}` } };
    }

    const existing = products[index];
    const merged = {
      ...existing,
      name: updatedData.name.trim(),
      categoryId: updatedData.categoryId,
      brand: updatedData.brand.trim(),
      price: Number(updatedData.price),
      originalPrice: updatedData.originalPrice ? Number(updatedData.originalPrice) : Number(updatedData.price),
      image: updatedData.image.trim(),
      images: Array.isArray(updatedData.images) && updatedData.images.length > 0 
        ? updatedData.images 
        : [updatedData.image.trim()],
      rating: updatedData.rating !== undefined ? Number(updatedData.rating) : existing.rating,
      stock: Number(updatedData.stock) || 0,
      specs: Array.isArray(updatedData.specs) ? updatedData.specs : (updatedData.specs ? String(updatedData.specs).split(',').map(s => s.trim()).filter(Boolean) : existing.specs),
      labels: Array.isArray(updatedData.labels) ? updatedData.labels : (updatedData.labels ? String(updatedData.labels).split(',').map(s => s.trim()).filter(Boolean) : existing.labels),
      isFlashSale: updatedData.isFlashSale !== undefined ? Boolean(updatedData.isFlashSale) : existing.isFlashSale,
      flashSaleProgress: updatedData.flashSaleProgress !== undefined ? Number(updatedData.flashSaleProgress) : existing.flashSaleProgress,
      isFeatured: updatedData.isFeatured !== undefined ? Boolean(updatedData.isFeatured) : existing.isFeatured,
      description: updatedData.description !== undefined ? updatedData.description.trim() : existing.description,
      updatedAt: new Date().toISOString()
    };

    products[index] = merged;
    storageService.set(STORAGE_KEY, products);

    return { success: true, data: merged };
  },

  /**
   * Xóa sản phẩm theo ID (Delete - Admin)
   * @param {string} id 
   * @returns {{ success: boolean, message?: string }}
   */
  delete(id) {
    const products = this.getAll();
    const filtered = products.filter(p => String(p.id) !== String(id));
    if (filtered.length === products.length) {
      return { success: false, message: `Không tìm thấy sản phẩm có ID: ${id}` };
    }
    storageService.set(STORAGE_KEY, filtered);
    return { success: true, message: 'Xóa sản phẩm thành công' };
  },

  /**
   * Khôi phục toàn bộ dữ liệu về danh sách mẫu ban đầu
   */
  resetToDefault() {
    storageService.set(STORAGE_KEY, DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  },

  /**
   * Tìm kiếm sản phẩm theo từ khóa (hỗ trợ tiếng Việt không dấu, tìm theo tên, hãng, thông số)
   * @param {string} keyword 
   * @param {Array} list 
   * @returns {Array}
   */
  search(keyword, list = null) {
    const products = list || this.getAll();
    if (!keyword || !keyword.trim()) return products;

    const cleanKeyword = removeVietnameseTones(keyword);

    return products.filter(p => {
      const matchName = removeVietnameseTones(p.name).includes(cleanKeyword);
      const matchBrand = removeVietnameseTones(p.brand).includes(cleanKeyword);
      const matchCategory = removeVietnameseTones(p.categoryId).includes(cleanKeyword);
      const matchSpecs = Array.isArray(p.specs) && p.specs.some(s => removeVietnameseTones(s).includes(cleanKeyword));
      return matchName || matchBrand || matchCategory || matchSpecs;
    });
  },

  /**
   * Bộ lọc đa tiêu chí
   * @param {Array} list 
   * @param {Object} criteria 
   * @param {string} [criteria.categoryId] 
   * @param {string} [criteria.brand] 
   * @param {number} [criteria.minPrice] 
   * @param {number} [criteria.maxPrice] 
   * @param {boolean} [criteria.isFlashSale] 
   * @param {boolean} [criteria.isFeatured] 
   * @returns {Array}
   */
  filter(list = null, criteria = {}) {
    let result = list || this.getAll();

    // Lọc theo Danh mục
    if (criteria.categoryId && criteria.categoryId !== 'all') {
      result = result.filter(p => p.categoryId === criteria.categoryId);
    }

    // Lọc theo Thương hiệu
    if (criteria.brand && criteria.brand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === criteria.brand.toLowerCase());
    }

    // Lọc theo Khoảng giá
    if (criteria.minPrice !== undefined && criteria.minPrice !== null && criteria.minPrice !== '') {
      result = result.filter(p => p.price >= Number(criteria.minPrice));
    }
    if (criteria.maxPrice !== undefined && criteria.maxPrice !== null && criteria.maxPrice !== '') {
      result = result.filter(p => p.price <= Number(criteria.maxPrice));
    }

    // Lọc Flash Sale
    if (criteria.isFlashSale !== undefined && criteria.isFlashSale !== null) {
      result = result.filter(p => Boolean(p.isFlashSale) === Boolean(criteria.isFlashSale));
    }

    // Lọc Sản phẩm nổi bật
    if (criteria.isFeatured !== undefined && criteria.isFeatured !== null) {
      result = result.filter(p => Boolean(p.isFeatured) === Boolean(criteria.isFeatured));
    }

    return result;
  },

  /**
   * Sắp xếp danh sách sản phẩm
   * @param {Array} list 
   * @param {string} sortBy - 'price-asc', 'price-desc', 'rating-desc', 'sold-desc', 'discount-desc', 'newest'
   * @returns {Array} Bản sao danh sách đã được sắp xếp
   */
  sort(list, sortBy = 'default') {
    const copy = [...list];
    switch (sortBy) {
      case 'price-asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'sold-desc':
        return copy.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      case 'discount-desc':
        return copy.sort((a, b) => {
          const discA = calculateDiscountPercent(a.price, a.originalPrice);
          const discB = calculateDiscountPercent(b.price, b.originalPrice);
          return discB - discA;
        });
      case 'newest':
        return copy.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return copy;
    }
  },

  /**
   * Lấy danh sách toàn bộ danh mục
   * @returns {Array}
   */
  getCategories() {
    return CATEGORIES;
  },

  /**
   * Lấy danh sách thương hiệu theo danh mục
   * @param {string} [categoryId] 
   * @returns {Array}
   */
  getBrands(categoryId = null) {
    if (categoryId && BRANDS[categoryId]) {
      return BRANDS[categoryId];
    }
    // Tổng hợp toàn bộ brand
    const allBrands = new Set();
    Object.values(BRANDS).forEach(brandList => {
      brandList.forEach(b => allBrands.add(b));
    });
    return Array.from(allBrands);
  }
};
