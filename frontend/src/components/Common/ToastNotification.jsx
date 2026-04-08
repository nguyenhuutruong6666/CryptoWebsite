import './ToastNotification.scss';

export default function ToastNotification({ toast, onClose }) {
  const { type, message } = toast;
  
  return (
    <div className={`toast-wrapper ${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' ? (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          ) : (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          )}
        </div>
        <p className="toast-message">{message}</p>
        <button className="toast-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
