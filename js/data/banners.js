/**
 * banners.js - Dữ liệu banner quảng cáo và khuyến mãi
 */

export const HERO_BANNERS = [
  {
    id: 'hero-banner-1',
    title: '',
    subtitle: '',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://media-asset.cellphones.com.vn/dashboard-v1/manage-banner/home-ip18-1026.png',
    fallbackBg: 'linear-gradient(135deg, #1f1f1f 0%, #3a3a3a 100%)',
    link: 'product-detail.html?id=iphone-18-pro-max-256gb'
  },
  {
    id: 'hero-banner-2',
    title: '',
    subtitle: '',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://media-asset.cellphones.com.vn/dashboard-v1/manage-banner/Z8_home_1.png',
    fallbackBg: 'linear-gradient(135deg, #0d274d 0%, #174b88 100%)',
    link: 'product-detail.html?id=samsung-galaxy-z8-series-256gb'
  },
  {
    id: 'hero-banner-3',
    title: '',
    subtitle: '',
    image: 'https://cdnv2.tgdd.vn/webmwg/dmx/Product/Image/desk-logoFirstScreen-model2-update7.png',
    fallbackBg: 'linear-gradient(135deg, #2b3a4a 0%, #ffffff 100%)',
    link: 'product-detail.html?id=iphone-duo-256gb'
  }
];

export const PROMO_MINI_BANNERS = [
  {
    id: 'mini-1',
    title: '',
    image: 'https://nguyencongpc.vn/media/banner/13_Octe701b213a8c6c1f7aa115256b257e3ff.jpg',
    fallbackBg: '#e74c3c',
    link: 'product.html?category=laptop'
  },
  {
    id: 'mini-2',
    title: '',
    image: 'https://nguyencongpc.vn/media/banner/19_Octc1fc865c30da3b1b82dac47170e14b35.jpg',
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
