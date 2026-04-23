import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout/AuthLayout';
import FormInput from '../../components/Auth/FormInput/FormInput';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../store/ToastContext';
import '../LoginPage/LoginPage.scss'; // Reuse styles from LoginPage

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (errors.submit) setErrors(prev => ({ ...prev, submit: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!form.email) errs.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự';
    
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!agreeTerms) {
      errs.terms = 'Bạn cần đồng ý với điều khoản sử dụng';
    }
    
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }

    setIsLoading(true);
    const res = await register(form.name, form.email, form.password);
    setIsLoading(false);
    
    if (res.success) {
      addToast('Đăng ký tài khoản thành công', 'success');
      navigate('/');
    } else {
      addToast(res.message || 'Đăng ký thất bại. Email có thể đã tồn tại.', 'error');
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản TCrypto"
      subtitle="Bắt đầu hành trình giao dịch crypto của bạn ngay hôm nay."
    >
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <FormInput
          id="register-name"
          label="Họ và tên"
          type="text"
          placeholder="Nhập họ và tên..."
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          icon={<UserIcon />}
          required
        />

        <FormInput
          id="register-email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<EmailIcon />}
          autoComplete="email"
          required
        />

        <FormInput
          id="register-password"
          label="Mật khẩu"
          type="password"
          placeholder="Tạo mật khẩu..."
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          icon={<LockIcon />}
          autoComplete="new-password"
          required
          hint="Mật khẩu phải có ít nhất 8 ký tự."
        />

        <FormInput
          id="register-confirm-password"
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu..."
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          icon={<LockIcon />}
          autoComplete="new-password"
          required
        />

        <div className="login-options" style={{ marginBottom: errors.terms ? '4px' : '16px', marginTop: '8px' }}>
          <label className="remember-me" style={{ alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={e => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
              }}
            />
            <span className="checkmark" style={{ marginTop: '2px' }} />
            <span style={{ lineHeight: '1.4' }}>
              Tôi đã đọc và đồng ý với <Link to="#" className="forgot-link">Điều khoản Dịch vụ</Link> và <Link to="#" className="forgot-link">Chính sách Bảo mật</Link> của TCrypto.
            </span>
          </label>
        </div>
        {errors.terms && <p style={{ color: '#F6465D', fontSize: '12px', marginTop: '0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ {errors.terms}</p>}

        <button
          type="submit"
          className={`btn-submit ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <span className="btn-spinner" /> : 'Tạo tài khoản'}
        </button>

        <p className="auth-switch">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-switch-link">Đăng nhập ngay</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
