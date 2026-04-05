import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.scss';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">TCrypto</span>
        </Link>

        {/* Main Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Thị trường
          </Link>
          <a href="#" className="nav-link">Mua Crypto</a>
          <a href="#" className="nav-link">Giao dịch</a>
          <a href="#" className="nav-link">Hợp đồng</a>
          <a href="#" className="nav-link">Earn</a>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Search */}
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm coin..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            <button className="btn-login">Đăng nhập</button>
            <button className="btn-register">Đăng ký</button>
          </div>

          {/* User Icon */}
          <button className="icon-btn" title="Tài khoản">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
