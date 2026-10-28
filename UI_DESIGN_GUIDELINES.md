# UI DESIGN GUIDELINES — Website bán điện thoại & thiết bị công nghệ

> **Phiên bản:** 1.0  
> **Nguồn tham chiếu:** 4 ảnh chụp giao diện trang chủ Thế Giới Di Động do người dùng cung cấp (28/10/2026).  
> **Mục đích:** Là **single source of truth** cho giao diện trong quá trình vibe coding bằng **HTML, CSS, JavaScript thuần**. Đảm bảo mọi trang, component và tính năng mới có diện mạo nhất quán.  
> **Phạm vi:** Thiết kế UI/UX tham khảo; không yêu cầu sao chép chính xác mọi nội dung, hình ảnh, chiến dịch quảng cáo hoặc tài sản thương hiệu gốc. Có thể dùng tên/logo riêng cho đồ án.

---

## 1. Định hướng thiết kế

- **Phong cách:** Website thương mại điện tử Việt Nam, dày thông tin, nhiều sản phẩm/ưu đãi nhưng dễ quét mắt; ưu tiên hiển thị giá, giảm giá và CTA.
- **Cảm giác thị giác:** Năng động, thân thiện, nhiều màu vàng–đen đặc trưng ở header, nền xám rất nhạt, nội dung trắng; riêng khu vực khuyến mãi sử dụng màu nóng để nổi bật.
- **Bố cục:** Desktop-first theo ảnh; nội dung ở giữa trang, chia thành các khối ngang liên tục; có các banner và lưới card sản phẩm.
- **Thứ tự ưu tiên:** Điều hướng → Tìm kiếm → Banner chính → Deal/khuyến mãi → Danh sách sản phẩm → Nội dung bổ sung → Footer.
- **Nguyên tắc:** Các trang chủ, danh sách, chi tiết sản phẩm, giỏ hàng phải dùng cùng hệ thống màu, font, khoảng cách, header/footer, button và card.

## 2. Design tokens — dùng chung toàn dự án

> Các giá trị là **ước lượng thiết kế để triển khai nhất quán**, không phải phép đo pixel chính xác từ trang gốc. Khai báo tại `css/variables.css` và **không hardcode lại màu/spacing** ở từng trang.

```css
:root {
  /* Brand */
  --color-primary: #ffd400;            /* vàng chủ đạo header */
  --color-primary-hover: #ffcb05;
  --color-primary-soft: #fff3b0;
  --color-text: #222222;
  --color-text-secondary: #666666;
  --color-text-muted: #888888;

  /* Background / border */
  --color-page: #f2f4f7;
  --color-surface: #ffffff;
  --color-surface-soft: #f7f8fa;
  --color-border: #e5e8ed;

  /* Commerce */
  --color-price: #e5252a;              /* giá bán / ưu đãi */
  --color-discount: #e5252a;
  --color-link: #2878e3;
  --color-cta-soft: #edf6ff;
  --color-rating: #f7a600;
  --color-deal: #c40014;               /* nền riêng khu deal đỏ */
  --color-flash: #ff9800;              /* countdown / thanh sốc */

  /* Layout */
  --container-max: 1200px;
  --page-gutter: 16px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Corners, elevation */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;
  --shadow-card: 0 2px 10px rgba(20, 30, 40, 0.06);

  /* Typography */
  --font-main: Arial, Helvetica, sans-serif;
  --font-xs: 11px;
  --font-sm: 12px;
  --font-base: 14px;
  --font-md: 16px;
  --font-lg: 20px;
  --font-xl: 24px;
}
```

### Typography

| Vai trò | Desktop đề xuất | Quy tắc |
|---|---|---|
| Nội dung, bộ lọc, điều hướng | 13–14px | Dùng màu chữ chính, tránh chữ quá nhạt |
| Tiêu đề section | 20–24px, 700 | Cùng cỡ và cách căn cho mọi section tương đương |
| Tên sản phẩm | 13–14px, 400–500 | Tối đa **2 dòng**; giữ chiều cao card đồng đều |
| Giá bán | 16–18px, 700 | Đỏ, là điểm nhấn mạnh nhất trong card |
| Giá gốc | 11–12px | Xám, gạch ngang |
| Giảm giá | 11–12px | Đỏ/cam, đặt ngay cạnh giá gốc |
| Nhãn thông số / trả góp | 10–11px | Nền xám nhạt, không tranh sự chú ý với giá |
| Chữ phụ/footer | 11–13px | Tương phản đủ đọc |

- Dùng một font hệ thống thống nhất; hạn chế tải nhiều font.
- Tiền Việt Nam hiển thị `12.990.000đ` hoặc `12.990.000₫` **nhất quán**, ưu tiên `Intl.NumberFormat('vi-VN')` cộng ký hiệu `₫`.
- Tiêu đề sản phẩm dùng ellipsis/multiline clamp; không làm vỡ card khi tên dài.

## 3. Grid và responsive

**Desktop ≥ 1200px:** `.container { width: min(calc(100% - 32px), 1200px); margin-inline: auto; }`. Lưới sản phẩm **6 cột** ở những khu vực rộng, `gap` khoảng **8–12px**, card mặt trắng; banner lớn full chiều rộng container. Hai banner ngang đặt cạnh nhau 2 cột.

**Laptop 992–1199px:** Container co theo viewport; lưới **4–5 cột** tùy không gian. Dùng `minmax(0,1fr)` để tránh tràn.

**Tablet 768–991px:** Lưới **3 cột**; thanh tìm kiếm co lại; banner 1–2 cột; điều hướng danh mục có thể cuộn ngang.

**Mobile < 768px:** Lưới **2 cột**, gap 8px; header rút gọn gồm logo, tìm kiếm, giỏ hàng; ẩn hoặc chuyển thanh danh mục thành menu/scroll ngang; sidebar quảng cáo 2 bên phải ẩn; banner tỷ lệ phù hợp mobile; nút dễ chạm tối thiểu ~40px.

**Nguyên tắc bắt buộc:** Không dùng chiều rộng cố định vượt viewport; tất cả ảnh `max-width: 100%`; không xuất hiện thanh cuộn ngang ở cấp trang.

## 4. Cấu trúc trang chủ theo thứ tự ảnh tham chiếu

```text
PAGE (background xám nhạt)
├── PromoTopBar (dải quảng cáo màu vàng phía trên; tùy chọn)
├── Header (nền vàng, sticky tùy chọn)
│   ├── Logo / tên shop
│   ├── Ô tìm kiếm bo tròn
│   ├── Đăng nhập / tài khoản
│   ├── Voucher / ưu đãi
│   ├── Giỏ hàng (badge số lượng)
│   └── Địa điểm / khu vực
├── CategoryNav (thanh danh mục ngang, nền vàng)
└── Main.container
    ├── HeroCarousel / hero banner ngang lớn
    ├── PaymentBenefitStrip (dải lợi ích thanh toán)
    ├── FlashSaleSection (nền trắng)
    │   ├── Header "Khuyến mãi online"
    │   ├── Tabs loại ưu đãi
    │   ├── Countdown / lịch phiên sale
    │   └── ProductGrid / ProductCarousel
    ├── DealSection (header banner vàng cam, thân đỏ đậm)
    │   ├── Banner "Deal đẹp có hạn"
    │   ├── Tabs danh mục
    │   ├── ProductGrid
    │   └── Nút "Xem thêm sản phẩm"
    ├── MiniBannerCarousel (2 banner ngang)
    ├── OnlineShoppingBenefits (các tile mua online)
    ├── RecommendedSection ("Gợi ý cho bạn", grid sản phẩm)
    ├── PromotionStores (3 banner dọc)
    ├── SocialNewsSection (tin/bài viết dạng card ảnh)
    ├── PopularSearches (tag từ khóa dạng pill)
    └── Footer
        ├── Tổng đài / hỗ trợ
        ├── Về công ty
        ├── Thông tin khác / chính sách
        ├── Website / mạng xã hội / chứng nhận
        └── Thông tin pháp lý
```

### 4.1 Header và category nav

**Nhận diện trong ảnh:** Nền vàng sáng kéo ngang toàn màn hình; nội dung canh giữa. Logo màu đen nằm trái; ô tìm kiếm nền trắng dạng pill; icon nét đơn giản đi cùng nhãn nhỏ; bên phải có phần chọn khu vực; hàng danh mục có icon và tên.

**Quy tắc:**
- Chiều cao tham khảo: thanh chức năng chính khoảng **50–60px**; hàng danh mục khoảng **32–40px**; dải banner trên cùng tùy chiến dịch.
- Ô tìm kiếm chiếm tỷ trọng lớn nhất sau logo. Placeholder ngắn, dễ hiểu (ví dụ `Bạn tìm gì hôm nay?`).
- Header sử dụng đồng nhất trên **mọi trang**; logo click về `index.html`, icon giỏ hàng click `cart.html`.
- Trạng thái hover: nền vàng sẫm nhẹ/nhấn màu; focus của input/keyboard có viền rõ.
- Sticky header là lựa chọn triển khai, **không bắt buộc** theo ảnh tĩnh; nếu bật phải tránh che nội dung.

### 4.2 Hero, banner và quảng cáo

- Hero hình chữ nhật ngang, góc bo **8–12px**, ưu tiên ảnh không bị kéo méo (`object-fit: cover` hoặc `contain` theo asset).
- Các banner khác giữ tỷ lệ ảnh gốc; không chèn chữ HTML trùng lên chữ đã có sẵn trong ảnh.
- Vùng banner đôi là 2 khung ngang bằng nhau, gap 8–12px.
- Quảng cáo dọc ở hai lề chỉ hiển thị nếu viewport còn đủ chỗ, đặt **ngoài container nội dung**, không đè card.
- Nếu thiếu ảnh đúng tỷ lệ, hiển thị placeholder màu trung tính theo kích cỡ khung thay vì làm méo ảnh.

### 4.3 Flash Sale — "Khuyến mãi online"

- Section tách biệt trên nền trắng, bo góc và padding khoảng 16px.
- Title đậm, nằm bên trái. Dưới title là hàng tab ngang; tab active có màu nhấn cam/vàng, các tab thường màu trắng.
- Countdown / phiên giờ là các pill bo tròn; phiên active nổi bật màu cam, các phiên sau dùng nền xám nhạt.
- Danh sách sản phẩm: 6 cột desktop, viền mỏng; phần lớn card đồng chiều cao.
- Badge trên card sale có thể gồm nhãn `AI`, `GIÁ SỐC`, `Trả chậm 0%` tùy dữ liệu. Không gắn nhãn sai cho tất cả sản phẩm.
- Thanh tiến độ bán chạy / số lượng còn lại sử dụng vàng/cam. Chỉ hiện khi có dữ liệu flash sale.

### 4.4 Deal Section — "Deal đẹp có hạn"

- Đây là **section chiến dịch**, không phải màu nền mặc định toàn site.
- Banner tiêu đề vàng–cam, đỏ đậm ở phần danh sách; padding phần danh sách 12–16px.
- Tabs nằm chính giữa, nút nhỏ bo khoảng 4px; active màu xanh sáng hoặc dùng màu active thống nhất.
- Card sản phẩm vẫn **trắng**, tương phản rõ với nền đỏ; giữ nguyên cấu trúc card của các section khác.
- Dưới grid có nút `Xem thêm sản phẩm` nền trắng, chữ màu xanh/đỏ theo ngữ cảnh, canh giữa.

### 4.5 Mua online và gợi ý

- Khối `Mua Online - Hàng chuẩn, giá mê`: nền trắng, title trái; hàng tile nhỏ gồm hình và caption 1–2 dòng. Cho phép cuộn/carousel khi màn hình hẹp.
- `Gợi ý cho bạn`: section trắng, title trái; sản phẩm hiển thị **nhiều hàng** (trong ảnh là 2 hàng, 6 cột), thẻ dùng chung ProductCard.
- Các section cách nhau khoảng 16–24px; không gộp toàn trang thành một nền trắng lớn.

### 4.6 Gian hàng ưu đãi, bài viết, từ khóa tìm kiếm

- `Gian hàng ưu đãi`: 3 ảnh banner đứng bằng kích thước, xếp ngang trên desktop; mobile chuyển thành scroll ngang hoặc 1–2 cột.
- `Mạng xã hội ...`: khối trắng với 4 card bài viết ngang; mỗi card có thumbnail tỷ lệ đồng nhất, tiêu đề 2–3 dòng; link xem thêm căn giữa phía dưới.
- `Mọi người cũng tìm kiếm`: nhóm từ khóa dạng pill nhỏ, nền xám/xanh rất nhạt, chữ tối hoặc xanh, tự wrap xuống hàng mới.

### 4.7 Footer

- Footer **nền trắng**, tách phần main bằng khoảng cách và/hoặc border.
- Desktop: 4 nhóm thông tin ngang (hỗ trợ, công ty, thông tin khác, hệ sinh thái/mạng xã hội).
- Text 11–13px; link xanh; icon xã hội/chứng nhận dưới nhóm phù hợp.
- Hàng cuối là thông tin pháp lý trong vùng nền xám nhạt, chữ nhỏ. Với đồ án, thay thông tin gốc bằng thông tin giả lập/nhận diện của nhóm; **không tự nhận là website chính thức**.

---

## 5. Component chuẩn: ProductCard

> **Tuyệt đối dùng lại một component/cấu trúc HTML và CSS** cho Flash Sale, Deal, Gợi ý và danh sách sản phẩm. Chỉ thay variant/data.

### 5.1 Thứ tự nội dung trong card

1. **Ảnh sản phẩm** ở vùng trên cùng, ảnh nằm giữa, cùng chiều cao khung.
2. **Badge** khuyến mãi (nếu có) ở vị trí cố định, không chèn vào dòng tên.
3. **Tên sản phẩm** tối đa 2 dòng.
4. **Chips cấu hình** (RAM, bộ nhớ, kích thước, trả góp...) nếu có.
5. **Giá hiện tại** đỏ, đậm.
6. **Giá gốc** gạch ngang và **% giảm giá** (nếu có).
7. **Rating** dạng sao vàng + số điểm/đã bán (chỉ hiện thông tin có thật trong dữ liệu giả lập).
8. **Flash progress** (chỉ variant flash-sale).
9. **Nút hành động** `Mua ngay` / `Thêm vào giỏ` tùy luồng.

### 5.2 Quy tắc hình học

- Card nền trắng, viền `1px solid var(--color-border)`, bo 4–8px.
- `padding: 10px 8px` hoặc 12px tùy diện tích; chiều cao tối thiểu thống nhất theo hàng.
- Khung ảnh có `aspect-ratio: 1 / 1` hoặc chiều cao cố định theo breakpoint; `object-fit: contain` để **không cắt sản phẩm**.
- Đặt `display:flex; flex-direction:column;` và `margin-top:auto` cho vùng cuối để nút nằm ngang hàng giữa các card.
- Hover desktop: nhấc nhẹ card và tăng shadow; tên sản phẩm có thể chuyển sang màu link.
- Trên mobile, bỏ bớt nhãn phụ nhưng vẫn hiện rõ **ảnh → tên → giá → hành động**.
- Không hiển thị giá/đánh giá/số lượng nếu dữ liệu là `undefined`; đưa placeholder hợp lý.

### 5.3 Variants

| Variant | Khác biệt cho phép | Điều phải giữ |
|---|---|---|
| `default` | Rating, thông số, giá | Card chuẩn |
| `flash-sale` | Countdown badge, progress, giá khuyến mãi | Vị trí ảnh/tên/giá |
| `deal` | Chip trả góp/khuyến mãi | Card trắng và cấu trúc chuẩn |
| `compact` | Ít thông số hơn ở viewport nhỏ | Ảnh, tên, giá, CTA |

### 5.4 CSS nền tảng (tham khảo)

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}
.product-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: box-shadow .2s, transform .2s;
}
.product-card:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
}
.product-card__image { width: 100%; aspect-ratio: 1 / 1; object-fit: contain; }
.product-card__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 2.8em;
}
.product-card__price { font-size: var(--font-md); font-weight: 700; color: var(--color-price); }
.product-card__old-price { color: var(--color-text-muted); text-decoration: line-through; }
.product-card__action { margin-top: auto; }
@media (max-width: 1199px) { .product-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 991px) { .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) { .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; } }
```

## 6. Quy tắc dùng chung trên các trang con

### 6.1 Trang danh sách / tìm kiếm (`products.html`, `search.html`)

- Giữ nguyên header, danh mục, container, footer.
- Breadcrumb mảnh phía trên: `Trang chủ > Danh mục`.
- Title danh mục căn trái, 20–24px; bộ lọc và sort theo hàng/khối trắng.
- Grid dùng **ProductCard** chuẩn, không tự tạo phiên bản khác màu hoặc khác cách hiển thị giá.
- Trạng thái không có sản phẩm: icon/illustration đơn giản, thông báo rõ và nút quay lại.

### 6.2 Trang chi tiết sản phẩm (`product-detail.html`)

- Header/footer, nền trang và breadcrumb như trang chủ.
- Desktop bố cục **2 cột**: gallery ảnh bên trái (khoảng 55–60%), thông tin mua hàng bên phải; mobile xếp dọc.
- Thông tin chính: tên sản phẩm → rating → giá nổi bật đỏ → giá gốc/giảm → lựa chọn màu/dung lượng → số lượng → `Thêm vào giỏ` và `Mua ngay` → ưu đãi/thông số.
- CTA primary sử dụng vàng chủ đạo hoặc màu nóng cho `Mua ngay`; CTA phụ trắng/viền vàng hoặc xanh nhạt. Cùng kích cỡ chiều cao 40–44px.
- Các khối mô tả, thông số, sản phẩm liên quan theo section trắng bo góc.

### 6.3 Trang giỏ hàng (`cart.html`)

- Header/footer đồng nhất. Vùng nội dung desktop có giỏ bên trái và tổng kết bên phải, mobile xếp dọc.
- Mỗi dòng: thumbnail → tên/biến thể → đơn giá đỏ → điều khiển số lượng → thành tiền → xóa.
- Panel tổng kết nền trắng: tạm tính, giảm giá (nếu có), tổng thanh toán và CTA rõ ràng.
- Giỏ trống có trạng thái riêng, nút `Tiếp tục mua sắm`.
- Không pha trộn UI của thanh toán nếu đồ án chỉ triển khai giỏ hàng.

## 7. Trạng thái tương tác bắt buộc

- **Navigation:** logo, danh mục, sản phẩm, giỏ hàng phải có link/handler thật; không dùng nút trang trí giả.
- **Search:** gõ từ khóa → kết quả đúng keyword; Enter hoạt động; nút xóa input nếu có.
- **Tabs:** active chỉ có 1 tab; đổi tab thì cập nhật sản phẩm tương ứng và trạng thái active.
- **Carousel:** mũi tên lùi/tiến hoạt động, không làm overflow trang; hỗ trợ chạm/swipe khi có thể.
- **Giỏ hàng:** thêm, tăng/giảm, xóa, cập nhật badge/tổng tiền ngay trên UI; xác định quy tắc số lượng tối thiểu là 1.
- **Feedback:** hover, focus-visible, disabled, loading/empty và thông báo thêm giỏ thành công.
- **Accessibility cơ bản:** dùng `<button>` cho thao tác, `<a>` cho điều hướng; ảnh có `alt`; input có label; icon-only button có `aria-label`; vùng click đủ lớn, tương phản đọc được.

## 8. Dữ liệu và tổ chức file (HTML/CSS/JS thuần)

> Không có backend/database. Dùng **mảng object** để hiển thị sản phẩm, danh mục, banner; `localStorage` chỉ cho dữ liệu người dùng thay đổi. **Không lưu trực tiếp session state vào file JS** vì trình duyệt không tự ghi ngược file nguồn.

```text
phone-store/
├── index.html
├── products.html
├── product-detail.html
├── cart.html
├── search.html                       # tùy chọn; có thể dùng products.html?q=...
├── assets/
│   ├── images/
│   │   ├── products/
│   │   ├── banners/
│   │   └── icons/
│   └── logos/
├── css/
│   ├── variables.css                 # tokens của tài liệu này
│   ├── reset.css
│   ├── global.css                    # body, container, typography
│   ├── components.css                # header, card, button, tabs...
│   ├── home.css
│   ├── products.css
│   ├── detail.css
│   ├── cart.css
│   └── responsive.css
└── js/
    ├── data/
    │   ├── products.js              # [{id, name, price,...}]
    │   ├── categories.js
    │   └── banners.js
    ├── services/
    │   ├── productService.js        # filter, find, sort; CRUD giả lập
    │   └── cartService.js           # localStorage CRUD
    ├── components/
    │   ├── header.js
    │   └── productCard.js
    ├── pages/
    │   ├── home.js
    │   ├── products.js
    │   ├── detail.js
    │   └── cart.js
    └── main.js
```

**Schema product đề xuất:**

```js
{
  id: 'iphone-18-pro-256',
  name: 'Điện thoại iPhone 18 Pro 256GB',
  categoryId: 'phone',
  brand: 'Apple',
  price: 29990000,
  originalPrice: 32990000,
  image: './assets/images/products/iphone-18-pro.png',
  images: [],
  rating: 4.9,
  reviewCount: 120,
  soldCount: 950,
  specs: ['256GB', '6.3 inch'],
  labels: ['Trả góp 0%'],
  isFlashSale: false,
  isFeatured: true,
  stock: 20
}
```

- Một nguồn `products` duy nhất phục vụ tất cả trang; tìm bằng `id` qua URL, ví dụ `product-detail.html?id=iphone-18-pro-256`.
- Nguồn dữ liệu có thể giữ cố định trong JS; thao tác thêm/sửa/xóa sản phẩm nếu cần CRUD admin thì ghi **bản override trong localStorage** (hoặc bộ nhớ runtime), không giả vờ rằng file `products.js` đã thay đổi.
- Ảnh nên có tỉ lệ, chất lượng, đường dẫn ổn định; chuẩn hóa tên file không dấu, không khoảng trắng.
- Render nội dung người dùng nhập bằng `textContent` hoặc escape HTML, không trực tiếp đưa dữ liệu không tin cậy vào `innerHTML`.

## 9. Quy chuẩn để AI tuân thủ khi vibe coding

### Bắt buộc (MUST)

1. **Đọc file MD này trước khi tạo/sửa UI**, coi đây là nguồn quyết định về thiết kế.
2. **Dùng lại tokens và component**; không tự chọn bảng màu/font/bo góc mới cho từng trang.
3. **Dùng Header, CategoryNav, Footer và ProductCard thống nhất** trên các trang áp dụng.
4. **Giữ đúng thứ tự phân cấp** trong card: ảnh → tên → thông số → giá → rating/ưu đãi → CTA.
5. **Dùng 6/4/3/2 cột** như quy tắc responsive, được điều chỉnh khi không gian thực tế yêu cầu.
6. **Giữ các section nền trắng, page nền xám nhạt**; màu đỏ đậm chỉ dùng cho khu chiến dịch Deal.
7. **Không thêm thư viện UI framework** (React, Vue, Bootstrap, Tailwind...) khi chưa được yêu cầu; chỉ HTML/CSS/JS thuần.
8. **Không hiển thị link, nút hoặc tab có vẻ tương tác nhưng không hoạt động**; nếu chưa có logic thì dùng trạng thái disabled và nhãn phù hợp.
9. Mọi trang phải không vỡ layout tại các mốc viewport **375, 768, 1024, 1440px**.
10. Tên lớp CSS đặt nhất quán theo component (khuyến nghị BEM như `.product-card__price`), không dùng selector toàn cục vô tình ảnh hưởng trang khác.

### Được phép linh hoạt (MAY)

- Rút gọn các section phụ (tin tức, mạng xã hội, banner dọc) theo phạm vi bài tập.
- Thay thông điệp/banner bằng dữ liệu giả lập của đồ án nhưng giữ **bố cục và kiểu trình bày**.
- Dùng icon SVG hoặc CSS tùy môi trường, đảm bảo cùng style nét/size.
- Thay số lượng card hiển thị theo dữ liệu thật; lưới phải tự thích nghi và không để card lỗi.

### Không làm (MUST NOT)

- Mỗi trang một header/footer khác nhau.
- Giá lúc xanh, lúc đen, lúc đỏ tùy trang; đổi cỡ ảnh thẻ sản phẩm theo section một cách tùy tiện.
- Dùng một banner stretch méo, hình sản phẩm bị crop mất góc, hoặc chữ trắng trên nền vàng thiếu tương phản.
- Lặp cấu trúc card bằng nhiều đoạn HTML không thống nhất.
- Nhét CSS inline khắp HTML thay vì style dùng chung.

## 10. Checklist nghiệm thu UI

- [ ] Header vàng đúng tông; logo/tìm kiếm/tài khoản/giỏ hàng thẳng hàng.
- [ ] Container toàn site canh giữa, cùng max-width; page background xám nhạt.
- [ ] Tất cả section có spacing, radius, title style thống nhất.
- [ ] Thẻ sản phẩm cùng ảnh chuẩn, tên 2 dòng, giá đỏ, giá gốc gạch ngang, CTA cùng hàng.
- [ ] Flash Sale có tab, countdown, badge và tiến độ **nếu dữ liệu hỗ trợ**.
- [ ] Deal có nền đỏ riêng; card trắng, không bị thay theme card.
- [ ] Banner/ảnh không méo; ảnh thiếu được thay thế có kiểm soát.
- [ ] Search và lọc sản phẩm thực sự hoạt động.
- [ ] Click card mở đúng chi tiết qua ID; thêm giỏ cập nhật badge và cart.
- [ ] Giỏ hàng tính toán đúng, làm mới trang vẫn giữ dữ liệu qua localStorage.
- [ ] Desktop/tablet/mobile không có overflow ngang, các component không chồng nhau.
- [ ] Có keyboard focus, alt, aria-label cho nút icon, trạng thái trống/lỗi hợp lý.
- [ ] Không sử dụng thông tin pháp lý/tư cách website chính thức của thương hiệu tham chiếu.

---

## 11. Prompt ngắn để gắn vào mỗi yêu cầu vibe coding

> Đọc `UI_DESIGN_GUIDELINES.md` và tuân thủ đầy đủ design tokens, layout, responsive và quy tắc tái sử dụng component của tài liệu. Dự án dùng HTML/CSS/JavaScript thuần, dữ liệu từ mảng object trong `js/data`, giỏ hàng lưu localStorage. Trước khi viết code, xác định component nào đã có để tái sử dụng; không tạo style riêng mâu thuẫn. Sau khi triển khai, tự kiểm tra giao diện ở 375/768/1024/1440px và đối chiếu checklist cuối tài liệu. Ưu tiên tính nhất quán giao diện hơn việc thêm hiệu ứng không cần thiết.

**Ghi chú:** Ảnh tham chiếu có các chương trình khuyến mãi và sản phẩm cụ thể tại thời điểm chụp; đây là **mẫu về hệ thống thị giác, không phải yêu cầu hardcode nội dung từng sản phẩm**.
