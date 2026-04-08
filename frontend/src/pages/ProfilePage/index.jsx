import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import FormInput from '../../components/Auth/FormInput';
import { useAuth } from '../../store/AuthContext';
import './ProfilePage.scss';

const STATS = [
  { label: 'Tổng tài sản ước tính', value: '$12,450.80', change: '+5.2%', isPositive: true },
  { label: 'Lãi/Lỗ 30 ngày', value: '+$640.25', change: '+12.4%', isPositive: true },
  { label: 'Giao dịch trong tháng', value: '142', change: '-12', isPositive: false },
];

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) {
      setForm({ 
        name: user.name || '', 
        email: user.email || '', 
        phone: user.phone || '' 
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main" style={{ justifyContent: 'center', minHeight: '60vh', color: '#fff' }}>
          Đang tải dữ liệu người dùng...
        </main>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({ name: form.name, phone: form.phone });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="tier-badge">{user.tier || 'Thành viên'}</span>
            </div>
            <h2 className="user-name">{user.name}</h2>
            <p className="user-id">ID: {user.id.substring(0, 8).toUpperCase()}</p>
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
            <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
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
                  <button className="btn-cancel" onClick={() => {
                    setIsEditing(false);
                    setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
                  }}>Hủy</button>
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
                disabled={true} 
                hint="Không thể thay đổi email."
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
                  <span style={{ color: '#0ECB81', fontWeight: 500 }}>{user.verificationLevel || 'Đã xác minh cơ bản'}</span>
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
                { action: 'Đăng nhập hệ thống (Lần cuối)', device: 'Chrome on Windows', ip: '127.0.0.1', time: 'Vừa xong' },
                { action: 'Đăng ký tài khoản', device: 'Web App TCrypto', ip: 'System', time: new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN') },
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
