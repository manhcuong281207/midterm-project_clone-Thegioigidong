/**
 * defaultProducts.js - Dữ liệu mặc định ban đầu cho website
 * Tuân thủ Schema chuẩn theo UI_DESIGN_GUIDELINES.md
 * Bao gồm các danh mục: Điện thoại (phone), Laptop (laptop), Tablet (tablet), Đồng hồ (watch), Phụ kiện (accessory)
 */

export const CATEGORIES = [
  { id: 'phone', name: 'Điện thoại', icon: '📱' },
  { id: 'laptop', name: 'Laptop', icon: '💻' },
  { id: 'tablet', name: 'Tablet', icon: '📟' },
  { id: 'watch', name: 'Đồng hồ', icon: '⌚' },
  { id: 'accessory', name: 'Phụ kiện', icon: '🎧' }
];

export const BRANDS = {
  phone: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'vivo'],
  laptop: ['Apple', 'Asus', 'Lenovo', 'Dell', 'HP'],
  tablet: ['Apple', 'Samsung', 'Xiaomi'],
  watch: ['Apple', 'Samsung', 'Garmin'],
  accessory: ['Apple', 'Anker', 'Baseus', 'Sony']
};

export const DEFAULT_PRODUCTS = [
  // --- ĐIỆN THOẠI ---
  {
    id: 'iphone-18-pro-max-256gb',
    name: 'iPhone 18 Pro Max 256GB',
    categoryId: 'phone',
    brand: 'Apple',
    price: 41990000,
    originalPrice: 44990000,
    image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-18-pro-max-01.jpg',
    images: [
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-18-pro-max-01.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-18-pro-max-06.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_18_pro_max_01.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_18_pro_max_02.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_18_pro_max_03.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_18_pro_max_04.jpg'
    ],
    rating: 4.9,
    reviewCount: 128,
    soldCount: 620,
    specs: ['6.9 inch OLED', 'ProMotion 120Hz', 'Apple A20 Pro', '256GB', 'Camera 48MP x3'],
    labels: ['Hàng mới', 'GIÁ SỐC', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 86,
    isFeatured: true,
    stock: 18,
    description: 'Màn hình OLED Super Retina XDR 6,9 inch ProMotion 120Hz độ sáng 3.000 nit, chip A20 Pro 2nm, bộ 3 camera 48MP zoom quang 4x, pin xem video 43 giờ, khung nhôm nguyên khối kháng nước IP68.'
  },
  {
    id: 'samsung-galaxy-z8-series-256gb',
    name: 'Samsung Galaxy Z Fold 8 Ultra 5G 12GB/256GB',
    categoryId: 'phone',
    brand: 'Samsung',
    price: 47990000,
    originalPrice: 52990000,
    image: 'https://media-asset.cellphones.com.vn/dashboard-v2/uploads/content-uploads/samsung-galaxy-z-fold8-ultra-5g-12gb-256gb-240773.jpg',
    images: [
      'https://media-asset.cellphones.com.vn/dashboard-v2/uploads/content-uploads/samsung-galaxy-z-fold8-ultra-5g-12gb-256gb-240773.jpg',
      'https://media-asset.cellphones.com.vn/dashboard-v2/uploads/content-uploads/samsung-galaxy-z-fold8-ultra-5g-12gb-256gb-800084.jpg'
    ],
    rating: 4.8,
    reviewCount: 76,
    soldCount: 340,
    specs: ['8.0 inch AMOLED 2X', 'Snapdragon 8 Elite Gen 5', '256GB', '12GB RAM', 'Camera 200MP'],
    labels: ['Galaxy AI', 'Hàng mới', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 72,
    isFeatured: true,
    stock: 12,
    description: 'Điện thoại gập cao cấp nhất dòng Z8, màn chính 8.0 inch 120Hz 3.000 nit, màn phụ 6.5 inch, chip Snapdragon 8 Elite Gen 5 3nm, camera chính 200MP quay 8K, pin 5.000mAh sạc 45W, thân máy chỉ 4.1mm khi mở.'
  },
  {
    id: 'iphone-duo-256gb',
    name: 'iPhone Duo 256GB',
    categoryId: 'phone',
    brand: 'Apple',
    price: 64990000,
    originalPrice: 69990000,
    image: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-duo-01.jpg',
    images: [
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-duo-01.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-duo-02.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-duo-03.jpg',
      'https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-duo-04.jpg'
    ],
    rating: 4.9,
    reviewCount: 45,
    soldCount: 180,
    specs: ['Trong 7.6 inch', 'Ngoài 5.4 inch', 'Chip A20 Pro', '256GB', 'Camera 48MP'],
    labels: ['Độc quyền', 'GIÁ SỐC', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 64,
    isFeatured: true,
    stock: 8,
    description: 'iPhone màn hình gập đầu tiên với màn trong 7.6 inch và màn ngoài 5.4 inch Super Retina XDR 120Hz, chip A20 Pro, camera 48MP Fusion, hai viên pin lithium-ion, 2 eSIM, bề mặt Nano-texture chống chói.'
  },
  {
    id: 'iphone-16-pro-max-256gb',
    name: 'iPhone 16 Pro Max 256GB',
    categoryId: 'phone',
    brand: 'Apple',
    price: 34490000,
    originalPrice: 34990000,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp'
    ],
    rating: 4.9,
    reviewCount: 342,
    soldCount: 1540,
    specs: ['6.9 inch', 'Super Retina XDR', 'Apple A18 Pro', '256GB', '8GB RAM'],
    labels: ['Trả góp 0%', 'GIÁ SỐC'],
    isFlashSale: true,
    flashSaleProgress: 92,
    isFeatured: true,
    stock: 25,
    description: 'Thiết kế Titan sa mạc đẳng cấp, viền mỏng nhất từ trước đến nay cùng nút Điều Khiển Camera hoàn toàn mới.'
  },
  {
    id: 'samsung-galaxy-s24-ultra-256gb',
    name: 'Samsung Galaxy S24 Ultra 5G 12GB/256GB',
    categoryId: 'phone',
    brand: 'Samsung',
    price: 27990000,
    originalPrice: 33990000,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp'
    ],
    rating: 4.8,
    reviewCount: 215,
    soldCount: 980,
    specs: ['6.8 inch', 'Dynamic AMOLED 2X', 'Snapdragon 8 Gen 3 for Galaxy', '256GB', '12GB RAM'],
    labels: ['Galaxy AI', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 78,
    isFeatured: true,
    stock: 30,
    description: 'Quyền năng Galaxy AI đỉnh cao, khung viền Titan sang trọng và camera zoom 100x cực nét kèm bút S-Pen.'
  },
  {
    id: 'xiaomi-14-ultra-512gb',
    name: 'Xiaomi 14 Ultra 5G 16GB/512GB',
    categoryId: 'phone',
    brand: 'Xiaomi',
    price: 28490000,
    originalPrice: 32990000,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/realme-xt/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/realme-xt/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/realme-xt/3.webp'
    ],
    rating: 4.7,
    reviewCount: 98,
    soldCount: 420,
    specs: ['6.73 inch', 'AMOLED 120Hz', 'Snapdragon 8 Gen 3', '512GB', '16GB RAM', 'Leica Quad Camera'],
    labels: ['Leica Camera', 'Trả góp 0%'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: true,
    stock: 18,
    description: 'Nhiếp ảnh đỉnh cao hợp tác cùng Leica với cụm 4 camera 50MP cảm biến 1 inch khẩu độ vô cấp.'
  },
  {
    id: 'oppo-find-x8-pro-512gb',
    name: 'OPPO Find X8 Pro 5G 16GB/512GB',
    categoryId: 'phone',
    brand: 'OPPO',
    price: 29990000,
    originalPrice: 31990000,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/3.webp'
    ],
    rating: 4.8,
    reviewCount: 64,
    soldCount: 310,
    specs: ['6.78 inch', 'AMOLED 1.5K', 'Dimensity 9400', '512GB', '16GB RAM', 'Hasselblad'],
    labels: ['Hasselblad AI', 'Trả góp 0%'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: false,
    stock: 22,
    description: 'Chụp ảnh chuyên nghiệp cùng hệ thống camera tele tiềm vọng kép kết hợp Hasselblad.'
  },
  {
    id: 'samsung-galaxy-a55-5g',
    name: 'Samsung Galaxy A55 5G 8GB/128GB',
    categoryId: 'phone',
    brand: 'Samsung',
    price: 9490000,
    originalPrice: 9990000,
    image: 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/3.webp'
    ],
    rating: 4.6,
    reviewCount: 412,
    soldCount: 2890,
    specs: ['6.6 inch', 'Super AMOLED 120Hz', 'Exynos 1480', '128GB', '8GB RAM', 'Pin 5000 mAh'],
    labels: ['Bán chạy', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 88,
    isFeatured: true,
    stock: 50,
    description: 'Khung viền kim loại sang trọng, camera 50MP chống rung quang học OIS và chuẩn kháng nước IP67.'
  },

  // --- LAPTOP ---
  {
    id: 'macbook-air-m3-13-16gb',
    name: 'MacBook Air 13 inch M3 16GB/256GB',
    categoryId: 'laptop',
    brand: 'Apple',
    price: 27990000,
    originalPrice: 29990000,
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/3.webp'
    ],
    rating: 4.9,
    reviewCount: 180,
    soldCount: 760,
    specs: ['Apple M3 8-core CPU', '16GB Unified RAM', '256GB SSD', '13.6 inch Liquid Retina', 'Pin 18 giờ'],
    labels: ['Bán chạy', 'Trả góp 0%'],
    isFlashSale: true,
    flashSaleProgress: 65,
    isFeatured: true,
    stock: 20,
    description: 'Hiệu năng vượt trội từ chip M3, thời lượng pin cả ngày dài và thiết kế siêu mỏng nhẹ thời thượng.'
  },
  {
    id: 'asus-vivobook-15-oled',
    name: 'Laptop Asus Vivobook 15 OLED A1505VA i5 13500H/16GB/512GB',
    categoryId: 'laptop',
    brand: 'Asus',
    price: 16990000,
    originalPrice: 19490000,
    image: 'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/3.webp'
    ],
    rating: 4.7,
    reviewCount: 95,
    soldCount: 630,
    specs: ['Intel Core i5 13500H', '16GB DDR4', '512GB SSD', '15.6 inch OLED Full HD', 'Intel Iris Xe'],
    labels: ['Màn hình OLED', 'Giảm 2.5 Triệu'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: true,
    stock: 15,
    description: 'Màn hình OLED rực rỡ chuẩn điện ảnh, chip dòng H hiệu năng cao đáp ứng mượt mà cả làm việc lẫn giải trí.'
  },
  {
    id: 'lenovo-legion-5-gaming',
    name: 'Laptop Gaming Lenovo Legion 5 16IRX9 i7 14650HX/16GB/512GB/RTX4060',
    categoryId: 'laptop',
    brand: 'Lenovo',
    price: 36990000,
    originalPrice: 40990000,
    image: 'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/3.webp'
    ],
    rating: 4.9,
    reviewCount: 140,
    soldCount: 520,
    specs: ['Intel Core i7 14650HX', '16GB DDR5', '512GB SSD', 'RTX 4060 8GB', '16 inch WQXGA 165Hz'],
    labels: ['Gaming Pro', 'RTX 4060'],
    isFlashSale: true,
    flashSaleProgress: 70,
    isFeatured: true,
    stock: 12,
    description: 'Cỗ máy gaming đỉnh cao với card đồ họa RTX 4060, tản nhiệt Coldfront độc quyền và màn hình 2K 165Hz.'
  },
  {
    id: 'hp-pavilion-15-eg3093tu',
    name: 'Laptop HP Pavilion 15 eg3093TU i5 1335U/16GB/512GB/Win11',
    categoryId: 'laptop',
    brand: 'HP',
    price: 15490000,
    originalPrice: 17490000,
    image: 'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/3.webp'
    ],
    rating: 4.6,
    reviewCount: 78,
    soldCount: 440,
    specs: ['Intel Core i5 1335U', '16GB RAM', '512GB SSD', '15.6 inch Full HD IPS', 'Vỏ nhôm'],
    labels: ['Văn phòng cao cấp'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: false,
    stock: 25,
    description: 'Vỏ kim loại sang trọng, cấu hình đa nhiệm mượt mà tối ưu cho dân văn phòng và sinh viên.'
  },

  // --- TABLET ---
  {
    id: 'ipad-pro-m4-11-256gb',
    name: 'iPad Pro M4 11 inch WiFi 256GB',
    categoryId: 'tablet',
    brand: 'Apple',
    price: 27990000,
    originalPrice: 28990000,
    image: 'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/2.webp',
      'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/3.webp'
    ],
    rating: 4.9,
    reviewCount: 88,
    soldCount: 380,
    specs: ['11 inch Ultra Retina XDR OLED', 'Apple M4', '256GB', '8GB RAM', 'Mỏng chỉ 5.3mm'],
    labels: ['Mới ra mắt', 'OLED kép'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: true,
    stock: 14,
    description: 'Độ mỏng kỷ lục, màn hình OLED 2 lớp Tandem OLED siêu sáng và sức mạnh đột phá từ chip M4.'
  },
  {
    id: 'samsung-galaxy-tab-s9-fe',
    name: 'Samsung Galaxy Tab S9 FE WiFi 6GB/128GB',
    categoryId: 'tablet',
    brand: 'Samsung',
    price: 8490000,
    originalPrice: 9990000,
    image: 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/2.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/3.webp'
    ],
    rating: 4.7,
    reviewCount: 165,
    soldCount: 890,
    specs: ['10.9 inch 90Hz', 'Exynos 1380', '128GB', '6GB RAM', 'Kèm bút S-Pen', 'IP68'],
    labels: ['Tặng bút S-Pen', 'Kháng nước'],
    isFlashSale: true,
    flashSaleProgress: 80,
    isFeatured: true,
    stock: 35,
    description: 'Trợ thủ ghi chú và vẽ vời đắc lực với bút S-Pen đi kèm cùng khả năng kháng nước kháng bụi chuẩn IP68.'
  },

  // --- ĐỒNG HỒ ---
  {
    id: 'apple-watch-series-10-46mm',
    name: 'Apple Watch Series 10 GPS 46mm viền nhôm dây cao su',
    categoryId: 'watch',
    brand: 'Apple',
    price: 11290000,
    originalPrice: 11990000,
    image: 'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp',
      'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/2.webp',
      'https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/3.webp'
    ],
    rating: 4.8,
    reviewCount: 130,
    soldCount: 650,
    specs: ['46mm OLED góc nhìn rộng', 'Apple S10 SiP', 'Đo ECG, SpO2', 'Cảnh báo ngưng thở khi ngủ'],
    labels: ['Màn hình lớn nhất', 'Sạc siêu nhanh'],
    isFlashSale: true,
    flashSaleProgress: 90,
    isFeatured: true,
    stock: 20,
    description: 'Màn hình mỏng hơn, góc nhìn rộng hơn và bổ sung tính năng theo dõi chứng ngưng thở khi ngủ tân tiến.'
  },
  {
    id: 'samsung-galaxy-watch-7-44mm',
    name: 'Samsung Galaxy Watch 7 LTE 44mm',
    categoryId: 'watch',
    brand: 'Samsung',
    price: 8990000,
    originalPrice: 9490000,
    image: 'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/1.webp',
      'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/2.webp',
      'https://cdn.dummyjson.com/product-images/womens-watches/rolex-datejust-women/3.webp'
    ],
    rating: 4.7,
    reviewCount: 82,
    soldCount: 410,
    specs: ['44mm Super AMOLED', 'Exynos W1000 3nm', 'Cảm biến BioActive thế hệ mới', 'GPS băng tần kép'],
    labels: ['Galaxy AI Watch', 'GPS kép'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: false,
    stock: 28,
    description: 'Tích hợp Galaxy AI huấn luyện viên sức khỏe, cảm biến BioActive theo dõi nhịp tim và giấc ngủ chính xác.'
  },
  {
    id: 'garmin-forerunner-165',
    name: 'Đồng hồ thông minh Garmin Forerunner 165 Music',
    categoryId: 'watch',
    brand: 'Garmin',
    price: 7490000,
    originalPrice: 7990000,
    image: 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/1.webp',
      'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/2.webp',
      'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/3.webp'
    ],
    rating: 4.9,
    reviewCount: 94,
    soldCount: 520,
    specs: ['1.2 inch AMOLED', 'Pin lên tới 11 ngày', 'Kế hoạch luyện tập Garmin Coach', 'Bộ nhớ nghe nhạc'],
    labels: ['Chuyên chạy bộ', 'Pin 11 ngày'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: true,
    stock: 16,
    description: 'Chuyên gia chạy bộ với màn hình AMOLED rực rỡ, GPS chuẩn xác và tính năng phân tích bài tập chuyên sâu.'
  },

  // --- PHỤ KIỆN ---
  {
    id: 'airpods-pro-2-type-c',
    name: 'Tai nghe Bluetooth AirPods Pro 2 MagSafe (USB-C)',
    categoryId: 'accessory',
    brand: 'Apple',
    price: 5490000,
    originalPrice: 6190000,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/3.webp'
    ],
    rating: 4.9,
    reviewCount: 520,
    soldCount: 3100,
    specs: ['Chống ồn chủ động ANC 2X', 'Âm thanh thích ứng', 'Cổng USB-C', 'Pin 30 giờ kèm hộp sạc'],
    labels: ['Chống ồn đỉnh cao', 'Giá sốc'],
    isFlashSale: true,
    flashSaleProgress: 95,
    isFeatured: true,
    stock: 40,
    description: 'Khả năng khử tiếng ồn vượt trội gấp 2 lần, cổng sạc USB-C tiện lợi và tính năng kiểm tra thính lực tiên tiến.'
  },
  {
    id: 'pin-sac-du-phong-anker-20000mah-30w',
    name: 'Pin sạc dự phòng 20.000mAh 30W Anker A1384',
    categoryId: 'accessory',
    brand: 'Anker',
    price: 890000,
    originalPrice: 1200000,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/2.webp'
    ],
    rating: 4.8,
    reviewCount: 230,
    soldCount: 1850,
    specs: ['Dung lượng 20.000mAh', 'Công suất sạc nhanh 30W', 'Tích hợp màn hình LCD hiển thị pin', 'Sạc 3 thiết bị'],
    labels: ['Giảm 25%', 'Bán chạy'],
    isFlashSale: true,
    flashSaleProgress: 84,
    isFeatured: false,
    stock: 55,
    description: 'Sạc nhanh hai chiều 30W cho điện thoại và máy tính bảng với màn hình kỹ thuật số hiển thị phần trăm pin thông minh.'
  },
  {
    id: 'cu-sac-nhanh-baseus-gan5-65w',
    name: 'Củ sạc nhanh Baseus GaN5 Pro 65W 3 cổng',
    categoryId: 'accessory',
    brand: 'Baseus',
    price: 490000,
    originalPrice: 650000,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/thumbnail.webp',
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/2.webp'
    ],
    rating: 4.7,
    reviewCount: 145,
    soldCount: 1200,
    specs: ['Công nghệ GaN5 nhỏ gọn', 'Công suất tối đa 65W', '2 cổng USB-C + 1 cổng USB-A', 'Sạc cho cả Laptop'],
    labels: ['Sạc laptop & điện thoại', 'Giá rẻ'],
    isFlashSale: false,
    flashSaleProgress: 0,
    isFeatured: false,
    stock: 60,
    description: 'Công nghệ GaN5 thu nhỏ kích thước tối đa, hỗ trợ sạc cùng lúc 3 thiết bị an toàn và ổn định.'
  }
];
