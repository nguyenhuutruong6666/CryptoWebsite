import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout/AuthLayout';
import FormInput from '../../components/Auth/FormInput/FormInput';
import { useToast } from '../../store/ToastContext';
import { authService } from '../../services/authService';
import './ForgotPasswordPage.scss';

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

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return setError('Vui lòng nhập email');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Email không hợp lệ');

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        addToast(res.message, 'success');
        setStep(2);
        setError('');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Vui lòng nhập mã OTP');
    if (otp.length !== 6) return setError('Mã OTP phải gồm 6 chữ số');

    setIsLoading(true);
    try {
      const res = await authService.verifyOTP(email, otp);
      if (res.success) {
        setStep(3);
        setError('');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return setError('Vui lòng nhập mật khẩu mới');
    if (newPassword.length < 6) return setError('Mật khẩu phải từ 6 ký tự');
    if (newPassword !== confirmPassword) return setError('Mật khẩu xác nhận không khớp');

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, newPassword);
      if (res.success) {
        addToast('Đặt lại mật khẩu thành công!', 'success');
        navigate('/login');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Khôi phục mật khẩu" : step === 2 ? "Xác minh OTP" : "Mật khẩu mới"}
      subtitle={
        step === 1 ? "Nhập email của bạn để nhận mã xác minh." : 
        step === 2 ? `Mã xác minh đã được gửi đến ${email}` : 
        "Tạo mật khẩu mới cho tài khoản của bạn."
      }
    >
      {step === 1 && (
        <form className="forgot-password-form" onSubmit={handleSendOTP} noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            error={error}
            icon={<EmailIcon />}
          />
          <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? <span className="btn-spinner" /> : 'Gửi mã OTP'}
          </button>
          <p className="auth-switch">Nhớ mật khẩu? <Link to="/login" className="auth-switch-link">Đăng nhập</Link></p>
        </form>
      )}

      {step === 2 && (
        <form className="forgot-password-form" onSubmit={handleVerifyOTP} noValidate>
          <FormInput
            label="Mã xác minh"
            type="text"
            placeholder="Nhập 6 chữ số..."
            value={otp}
            onChange={(e) => { 
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
              setOtp(val); 
              setError(''); 
            }}
            error={error}
            icon={<ShieldIcon />}
          />
          <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? <span className="btn-spinner" /> : 'Xác minh'}
          </button>
          <div className="resend-container">
            <p className="auth-switch">Không nhận được mã? <span className="auth-switch-link" onClick={handleSendOTP} style={{cursor: 'pointer'}}>Gửi lại</span></p>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="forgot-password-form" onSubmit={handleResetPassword} noValidate>
          <FormInput
            label="Mật khẩu mới"
            type="password"
            placeholder="Ít nhất 6 ký tự..."
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
            icon={<LockIcon />}
          />
          <FormInput
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu mới..."
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            error={error}
            icon={<LockIcon />}
          />
          <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? <span className="btn-spinner" /> : 'Đặt lại mật khẩu'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
