/**
 * footer.js - Component Footer chuẩn TGDD tái sử dụng cho mọi trang
 * Tuân thủ UI_DESIGN_GUIDELINES.md
 */

/**
 * Render Footer vào container hoặc cuối body
 * @param {string} [containerId='footer-container']
 */
export function initFooter(containerId = 'footer-container') {
  let container = document.getElementById(containerId);

  // Nếu trang chưa có thẻ chứa, tự động tạo và chèn vào cuối body
  if (!container) {
    container = document.createElement('footer');
    container.id = containerId;
    container.className = 'site-footer';
    document.body.appendChild(container);
  } else {
    container.className = 'site-footer';
  }

  container.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <!-- Cột 1: Tổng đài hỗ trợ -->
        <div class="footer-col">
          <h4>Tổng đài hỗ trợ (Miễn phí)</h4>
          <ul class="footer-links">
            <li>Gọi mua hàng: <span class="footer-hotline">1800.1060</span> (7:30 - 22:00)</li>
            <li>Khiếu nại: <span class="footer-hotline">1800.1062</span> (8:00 - 21:30)</li>
            <li>Bảo hành: <span class="footer-hotline">1800.1064</span> (8:00 - 21:00)</li>
            <li>Hỗ trợ kỹ thuật: <strong>1800.1763</strong></li>
          </ul>
        </div>

        <!-- Cột 2: Về công ty -->
        <div class="footer-col">
          <h4>Về chúng tôi</h4>
          <ul class="footer-links">
            <li><a href="index.html">Giới thiệu hệ thống cửa hàng</a></li>
            <li><a href="product.html">Chính sách tuyển dụng</a></li>
            <li><a href="product.html">Gửi góp ý, khiếu nại</a></li>
            <li><a href="admin.html">Trang quản trị sản phẩm (Admin)</a></li>
          </ul>
        </div>

        <!-- Cột 3: Chính sách & Dịch vụ -->
        <div class="footer-col">
          <h4>Chính sách & Hỗ trợ</h4>
          <ul class="footer-links">
            <li><a href="#">Chính sách bảo hành 12 tháng</a></li>
            <li><a href="#">Chính sách đổi trả 1 đổi 1 trong 30 ngày</a></li>
            <li><a href="#">Giao hàng siêu tốc 2 giờ</a></li>
            <li><a href="#">Hướng dẫn mua hàng trả góp 0%</a></li>
          </ul>
        </div>

        <!-- Cột 4: Kết nối & Thanh toán -->
        <div class="footer-col">
          <h4>Phương thức thanh toán</h4>
          <div style="display: flex; gap: 8px; font-size: 20px; margin-bottom: 14px;">
            <span>💳</span>
            <span>📱</span>
            <span>💵</span>
            <span>🏦</span>
          </div>
          <h4>Kết nối với chúng tôi</h4>
          <div style="display: flex; gap: 10px; font-size: 18px;">
            <a href="#" title="Facebook">🌐</a>
            <a href="#" title="Youtube">📺</a>
            <a href="#" title="Zalo">💬</a>
            <a href="#" title="Tiktok">🎵</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 Đồ án môn Phát triển Web — Clone giao diện & chức năng Thế Giới Di Động.</p>
        <p>Mục đích nghiên cứu & học tập (HTML, CSS, JavaScript thuần). Không sử dụng cho mục đích thương mại.</p>
      </div>
    </div>
  `;
}
