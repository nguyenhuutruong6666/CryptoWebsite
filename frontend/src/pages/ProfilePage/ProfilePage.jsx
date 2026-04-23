import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import FormInput from '../../components/Auth/FormInput/FormInput';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../store/ToastContext';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Pagination from '../../components/Common/Pagination';
import Footer from '../../components/Footer/Footer';
import { adminService } from '../../services/adminService';
import './ProfilePage.scss';

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // Admin states
  const [users, setUsers] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [viewingUser, setViewingUser] = useState(null); // Cho Modal xem chi tiết
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      setForm({ 
        name: user.name || '', 
        email: user.email || '', 
        phone: user.phone || '' 
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'system_accounts' && user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [activeTab, user]);

  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    const res = await adminService.getUsers();
    if (res.success) {
      setUsers(res.data);
    } else {
      addToast(res.message, 'error');
    }
    setIsFetchingUsers(false);
  };

  const filteredUsers = users.filter(u => {
    const nameStr = u.name || '';
    const emailStr = u.email || '';
    const query = adminSearchQuery ? adminSearchQuery.toLowerCase() : '';
    return nameStr.toLowerCase().includes(query) || emailStr.toLowerCase().includes(query);
  });

  const ITEMS_PER_PAGE = 10;
  const totalAdminPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (adminCurrentPage - 1) * ITEMS_PER_PAGE,
    adminCurrentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setAdminCurrentPage(1);
  }, [adminSearchQuery]);

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

  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const executeSave = async () => {
    setShowConfirm(false);
    const res = await updateProfile({ name: form.name, phone: form.phone });
    if (res.success) {
      setIsEditing(false);
      addToast('Lưu thông tin thành công!', 'success');
    } else {
      addToast(res.message || 'Có lỗi xảy ra khi lưu thay đổi.', 'error');
    }
  };

  const confirmDeleteUser = (u) => {
    setUserToDelete(u);
    setShowDeleteConfirm(true);
  };

  const executeDeleteUser = async () => {
    setShowDeleteConfirm(false);
    if (!userToDelete) return;
    
    const res = await adminService.deleteUser(userToDelete.id);
    if (res.success) {
      addToast('Xóa người dùng thành công!', 'success');
      setUsers(users.filter(u => u.id !== userToDelete.id));
    } else {
      addToast(res.message || 'Lỗi khi xóa người dùng.', 'error');
    }
    setUserToDelete(null);
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
              { id: 'activity', label: 'Lịch sử hoạt động', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
              ...(user?.role === 'ADMIN' ? [{ id: 'system_accounts', label: 'Quản lý tài khoản hệ thống', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' }] : [])
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
            <h1 className="content-title">
              {activeTab === 'overview' && 'Tổng quan'}
              {activeTab === 'activity' && 'Lịch sử hoạt động'}
              {activeTab === 'system_accounts' && 'Quản lý tài khoản hệ thống'}
            </h1>
            <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
          </div>

          {activeTab === 'overview' && (
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
                    <button className="btn-save" onClick={handleSaveClick}>Lưu thay đổi</button>
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
          )}

          {activeTab === 'activity' && (
            <div className="info-section">
              <div className="section-header">
                <h2>Lịch sử đăng nhập & bảo mật</h2>
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
          )}

          {activeTab === 'system_accounts' && user?.role === 'ADMIN' && (
            <div className="info-section">
              <div className="section-header">
                <div className="header-left">
                  <h2>Quản lý người dùng hệ thống</h2>
                  <span className="user-count">Tổng cộng: {filteredUsers.length} tài khoản</span>
                </div>
                <div className="header-right">
                  <div className="admin-search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm người dùng..." 
                      value={adminSearchQuery}
                      onChange={e => setAdminSearchQuery(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="admin-table-container">
                {isFetchingUsers ? (
                  <div className="spinner" style={{ margin: '40px auto' }} />
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
                        </tr>
                      ) : (
                        currentUsers.map((u, index) => (
                          <tr key={u.id}>
                            <td>{(adminCurrentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                            <td className="fw-500">{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge ${u.role?.name === 'ADMIN' ? 'admin' : 'user'}`}>
                                {u.role?.name || 'USER'}
                              </span>
                            </td>
                            <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className="action-cells">
                              <button className="btn-icon btn-view" title="Xem chi tiết" onClick={() => setViewingUser(u)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              </button>
                              <button 
                                className="btn-icon btn-delete" 
                                title="Xóa tài khoản" 
                                onClick={() => confirmDeleteUser(u)}
                                disabled={u.id === user.id}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {filteredUsers.length > 0 && !isFetchingUsers && (
                <div className="admin-pagination">
                  <Pagination 
                    currentPage={adminCurrentPage} 
                    totalPages={totalAdminPages} 
                    onPageChange={setAdminCurrentPage} 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Chi Tiết User */}
      {viewingUser && (
        <div className="modal-overlay" onClick={() => setViewingUser(null)}>
          <div className="modal-content user-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết người dùng</h3>
              <button className="btn-close" onClick={() => setViewingUser(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{viewingUser.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Họ và tên:</span>
                <span className="detail-value">{viewingUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{viewingUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">SĐT:</span>
                <span className="detail-value">{viewingUser.phone || 'Chưa cung cấp'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cấp độ (Tier):</span>
                <span className="detail-value">{viewingUser.tier || 'Thành viên cơ bản'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vai trò:</span>
                <span className={`role-badge ${viewingUser.role?.name === 'ADMIN' ? 'admin' : 'user'}`}>
                  {viewingUser.role?.name}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Xác minh:</span>
                <span className="detail-value">{viewingUser.verificationLevel || 'Đã xác minh cơ bản'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ngày tham gia:</span>
                <span className="detail-value">{new Date(viewingUser.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Xác nhận lưu thay đổi"
        message="Thông tin mới sẽ được áp dụng vào tài khoản của bạn. Chắc chắn tiếp tục?"
        onConfirm={executeSave}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Cảnh báo: Xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản của người dùng "${userToDelete?.name}" (${userToDelete?.email}) không? Hành động này sẽ xóa toàn bộ dữ liệu của họ và không thể hoàn tác.`}
        onConfirm={executeDeleteUser}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <Footer />
    </div>
  );
}
