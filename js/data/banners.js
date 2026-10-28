/**
 * banners.js - Dữ liệu banner quảng cáo và khuyến mãi
 */

export const HERO_BANNERS = [
  {
    id: 'hero-banner-1',
    title: 'iPhone 16 Pro Max - Titan sa mạc đẳng cấp',
    subtitle: 'Ưu đãi đến 3 triệu - Trả góp 0%',
    image: 'https://cdn.tgdd.vn/2024/09/banner/IP16-1200-300-1200x300.jpg',
    fallbackBg: 'linear-gradient(135deg, #1f1f1f 0%, #3a3a3a 100%)',
    link: 'product-detail.html?id=iphone-16-pro-max-256gb'
  },
  {
    id: 'hero-banner-2',
    title: 'Samsung Galaxy S24 Ultra - Quyền năng Galaxy AI',
    subtitle: 'Thu cũ đổi mới trợ giá 5 triệu',
    image: 'https://cdn.tgdd.vn/2024/09/banner/S24-Ultra-1200-300-1200x300.jpg',
    fallbackBg: 'linear-gradient(135deg, #0d274d 0%, #174b88 100%)',
    link: 'product-detail.html?id=samsung-galaxy-s24-ultra-256gb'
  },
  {
    id: 'hero-banner-3',
    title: 'MacBook Air M3 - Đỉnh cao mỏng nhẹ',
    subtitle: 'Giảm ngay 2 triệu - Tặng balo cao cấp',
    image: 'https://cdn.tgdd.vn/2024/09/banner/Macbook-M3-1200-300-1200x300.jpg',
    fallbackBg: 'linear-gradient(135deg, #2b3a4a 0%, #4b6584 100%)',
    link: 'product-detail.html?id=macbook-air-m3-13-16gb'
  }
];

export const PROMO_MINI_BANNERS = [
  {
    id: 'mini-1',
    title: 'Lễ hội Gaming - Giảm đến 5 triệu',
    image: 'https://cdn.tgdd.vn/2024/09/banner/laptop-gaming-390-210-390x210.jpg',
    fallbackBg: '#e74c3c',
    link: 'product.html?category=laptop'
  },
  {
    id: 'mini-2',
    title: 'Phụ kiện chính hãng - Mua 1 tặng 1',
    image: 'https://cdn.tgdd.vn/2024/09/banner/phu-kien-390-210-390x210.jpg',
    fallbackBg: '#f39c12',
    link: 'product.html?category=accessory'
  }
];

export const PAYMENT_BENEFITS = [
  { icon: '💳', title: 'Giảm đến 1 triệu', subtitle: 'Qua thẻ tín dụng VIB, VPBank' },
  { icon: '⚡', title: 'Trả góp 0% lãi suất', subtitle: 'Thủ tục đơn giản trong 5 phút' },
  { icon: '🚚', title: 'Giao nhanh 2 giờ', subtitle: 'Miễn phí đơn từ 500.000₫' },
  { icon: '🔄', title: 'Thu cũ đổi mới', subtitle: 'Trợ giá lên đến 3.000.000₫' }
];
