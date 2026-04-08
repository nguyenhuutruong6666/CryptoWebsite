import { Link } from 'react-router-dom';
import './AuthLayout.scss';

const STATS = [
  { label: 'Người dùng', value: '10M+' },
  { label: 'Quốc gia', value: '180+' },
  { label: 'Giao dịch/ngày', value: '$2B+' },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <Link to="/" className="auth-brand-logo">
            <span className="auth-logo-icon">₿</span>
            <span className="auth-logo-text">TCrypto</span>
          </Link>

          <div className="auth-brand-content">
            <h1 className="auth-brand-title">
              Giao dịch crypto<br />
              <span className="auth-brand-highlight">an toàn & thông minh</span>
            </h1>
            <p className="auth-brand-desc">
              Theo dõi giá thực, phân tích thị trường và giao dịch với hàng triệu người dùng trên toàn cầu.
            </p>

            <div className="auth-brand-stats">
              {STATS.map(s => (
                <div key={s.label} className="auth-stat-item">
                  <span className="auth-stat-value">{s.value}</span>
                  <span className="auth-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-brand-orbs">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>

          <div className="auth-ticker-strip">
            {['BTC $84,200', 'ETH $2,150', 'BNB $590', 'SOL $135', 'XRP $2.10'].map((t, i) => (
              <span key={i} className="ticker-item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-form-header">
            <h2 className="auth-form-title">{title}</h2>
            {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
