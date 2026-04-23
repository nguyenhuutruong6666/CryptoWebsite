import { Link } from 'react-router-dom';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-logo">TCrypto</Link>
            <p className="brand-desc">
              Nền tảng giao dịch tiền điện tử hàng đầu, cung cấp dữ liệu thị trường theo thời gian thực và trải nghiệm đầu tư an toàn, minh bạch.
            </p>
          </div>
          
          <div className="footer-links-group">
            <h4>Về chúng tôi</h4>
            <ul>
              <li><Link to="#">Thông tin công ty</Link></li>
              <li><Link to="#">Tuyển dụng</Link></li>
              <li><Link to="#">Quy định giao dịch</Link></li>
              <li><Link to="#">Tin tức & Sự kiện</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="#">Trung tâm trợ giúp</Link></li>
              <li><Link to="#">Gửi yêu cầu hỗ trợ</Link></li>
              <li><Link to="#">Phí giao dịch</Link></li>
              <li><Link to="#">Hướng dẫn API</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Pháp lý</h4>
            <ul>
              <li><Link to="#">Điều khoản dịch vụ</Link></li>
              <li><Link to="#">Chính sách bảo mật</Link></li>
              <li><Link to="#">Tuyên bố rủi ro</Link></li>
              <li><Link to="#">Tuân thủ quy định</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} TCrypto. Đã đăng ký bản quyền.
          </div>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.728.843-2.69 1.033A4.168 4.168 0 0 0 15.866 3.8c-2.31 0-4.182 1.88-4.182 4.2 0 .33.037.65.108.956-3.476-.174-6.56-1.85-8.625-4.385a4.2 4.2 0 0 0-.566 2.11c0 1.458.738 2.744 1.86 3.498a4.148 4.148 0 0 1-1.894-.526v.053c0 2.036 1.44 3.734 3.35 4.12-.35.096-.72.148-1.1.148-.27 0-.53-.026-.786-.075.53 1.67 2.072 2.887 3.896 2.92a8.397 8.397 0 0 1-5.202 1.803c-.337 0-.67-.02-.998-.06 1.846 1.19 4.037 1.883 6.388 1.883 7.665 0 11.857-6.38 11.857-11.91 0-.182-.004-.363-.012-.544.814-.59 1.52-1.325 2.08-2.15z"/></svg>
            </a>
            <a href="#" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
