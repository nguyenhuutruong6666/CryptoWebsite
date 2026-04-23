import './Pagination.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const isSinglePage = totalPages <= 1;

  const handlePage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  const pages = [];
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  
  if (currentPage - 1 <= 2) end = Math.min(totalPages, 5);
  if (totalPages - currentPage <= 2) start = Math.max(1, totalPages - 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <button 
        className="btn-page prev-next" 
        disabled={currentPage === 1}
        onClick={() => handlePage(currentPage - 1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      {start > 1 && (
        <>
          <button className="btn-page" onClick={() => handlePage(1)}>1</button>
          {start > 2 && <span className="dots">...</span>}
        </>
      )}

      {pages.map(page => (
        <button 
          key={page} 
          className={`btn-page ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePage(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="dots">...</span>}
          <button className="btn-page" onClick={() => handlePage(totalPages)}>{totalPages}</button>
        </>
      )}

      <button 
        className="btn-page prev-next" 
        disabled={currentPage === totalPages}
        onClick={() => handlePage(currentPage + 1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
}
