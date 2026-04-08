import { useState } from 'react';
import Navbar from '../../components/Navbar';
import FormInput from '../../components/Auth/FormInput';
import './ProfilePage.scss';

// Mock user data
const USER_DATA = {
  id: 'UID-8492749',
  name: 'Nguyễn Hữu Trường',
  email: 'truong@example.com',
  joinDate: '15/08/2025',
  tier: 'VIP 1',
  verificationLevel: 'Đã xác minh Plus',
};

const STATS = [
  { label: 'Tổng tài sản ước tính', value: '$12,450.80', change: '+5.2%', isPositive: true },
  { label: 'Lãi/Lỗ 30 ngày', value: '+$640.25', change: '+12.4%', isPositive: true },
  { label: 'Giao dịch trong tháng', value: '142', change: '-12', isPositive: false },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: USER_DATA.name, email: USER_DATA.email, phone: '0987654321' });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: Call API to save profile
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <main className="profile-main">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-brief">
            <div className="avatar-wrapper">
              <div className="avatar">
                {USER_DATA.name.charAt(0)}
              </div>
              <span className="tier-badge">{USER_DATA.tier}</span>
            </div>
            <h2 className="user-name">{USER_DATA.name}</h2>
            <p className="user-id">ID: {USER_DATA.id}</p>
          </div>

          <nav className="profile-nav">
            {[
              { id: 'overview', label: 'Tổng quan', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
              { id: 'security', label: 'Bảo mật', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
              { id: 'verification', label: 'Xác minh', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3' },
              { id: 'api', label: 'Quản lý API', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  {tab.icon.split(' M').map((d, i) => <path key={i} d={i > 0 ? `M${d}` : d} />)}
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="profile-content">
          <div className="content-header">
            <h1 className="content-title">Quản lý tài khoản</h1>
            <button className="btn-logout">Đăng xuất</button>
          </div>

          <div className="stats-grid">
            {STATS.map(stat => (
              <div key={stat.label} className="stat-card">
                <p className="stat-label">{stat.label}</p>
                <div className="stat-value-row">
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="info-section">
            <div className="section-header">
              <h2>Thông tin cá nhân</h2>
              {!isEditing ? (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>Hủy</button>
                  <button className="btn-save" onClick={handleSave}>Lưu thay đổi</button>
                </div>
              )}
            </div>

            <form className="info-grid">
              <FormInput
                label="Họ và tên"
                value={form.name}
                onChange={handleChange('name')}
                disabled={!isEditing}
              />
              <FormInput
                label="Địa chỉ Email"
                value={form.email}
                onChange={handleChange('email')}
                disabled={!isEditing}
              />
              <FormInput
                label="Số điện thoại"
                value={form.phone}
                onChange={handleChange('phone')}
                disabled={!isEditing}
              />
              <div className="info-item">
                <label className="form-label">Cấp độ xác minh</label>
                <div className="verification-status">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0ECB81" strokeWidth={2} style={{ width: 18, height: 18 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span style={{ color: '#0ECB81', fontWeight: 500 }}>{USER_DATA.verificationLevel}</span>
                </div>
              </div>
            </form>
          </div>

          <div className="info-section">
            <div className="section-header">
              <h2>Lịch sử hoạt động gần đây</h2>
            </div>
            
            <div className="activity-list">
              {[
                { action: 'Đăng nhập thành công', device: 'Chrome on Windows', ip: '192.168.1.1', time: '10 phút trước' },
                { action: 'Rút tiền', device: '0.15 BTC', ip: 'Ví: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', time: '2 ngày trước' },
                { action: 'Giao dịch Spot', device: 'Mua 1.5 ETH / USDT', ip: 'Khớp lệnh: Hoàn tất', time: '3 ngày trước' },
              ].map((item, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-action">{item.action}</h4>
                    <p className="activity-meta">{item.device} • {item.ip}</p>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
