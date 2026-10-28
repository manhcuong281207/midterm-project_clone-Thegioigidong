/**
 * toast.js - Tiện ích hiển thị thông báo nổi Toast Notification
 * Hoạt động độc lập không phụ thuộc thư viện ngoài
 */

let toastContainer = null;

function ensureToastContainer() {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  toastContainer = document.getElementById('tech-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'tech-toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      max-width: calc(100vw - 40px);
      width: 360px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

const THEMES = {
  success: { bg: '#10b981', border: '#059669', color: '#ffffff' },
  error: { bg: '#ef4444', border: '#dc2626', color: '#ffffff' },
  warning: { bg: '#f59e0b', border: '#d97706', color: '#ffffff' },
  info: { bg: '#2563eb', border: '#1d4ed8', color: '#ffffff' }
};

/**
 * Hiển thị thông báo Toast
 * @param {string} message - Nội dung thông báo
 * @param {'success'|'error'|'warning'|'info'} type - Loại thông báo
 * @param {number} duration - Thời gian hiển thị (ms), mặc định 3000ms
 */
export function showToast(message, type = 'success', duration = 3000) {
  if (typeof document === 'undefined') return;

  const container = ensureToastContainer();
  const theme = THEMES[type] || THEMES.info;
  const icon = ICONS[type] || ICONS.info;

  const toast = document.createElement('div');
  toast.className = `tech-toast tech-toast--${type}`;
  toast.style.cssText = `
    pointer-events: auto;
    background: #ffffff;
    color: #1f2937;
    border-left: 5px solid ${theme.bg};
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  `;

  toast.innerHTML = `
    <span style="
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${theme.bg};
      color: #ffffff;
      font-weight: bold;
      font-size: 13px;
      flex-shrink: 0;
    ">${icon}</span>
    <span style="flex: 1; word-break: break-word;">${message}</span>
    <button type="button" aria-label="Đóng" style="
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
      line-height: 1;
    ">&times;</button>
  `;

  const closeBtn = toast.querySelector('button');
  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 250);
  };

  closeBtn.addEventListener('click', removeToast);

  container.appendChild(toast);

  // Kích hoạt transition xuất hiện
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Tự động đóng sau duration
  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}
