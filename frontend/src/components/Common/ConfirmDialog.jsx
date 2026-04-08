import './ConfirmDialog.scss';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Hủy bỏ</button>
          <button className="btn-confirm" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
