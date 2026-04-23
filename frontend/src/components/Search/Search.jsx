import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../../store/MarketContext';
import { getCoinName, getCoinLogo } from '../../utils/coinHelpers';
import './Search.scss';

export default function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { markets } = useMarket();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = markets
    .filter(coin =>
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCoinName(coin.symbol).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6);

  const handleSelectCoin = (symbol) => {
    setShowDropdown(false);
    setSearchQuery('');
    if (onSearch) onSearch('');
    navigate(`/coin/${symbol.toLowerCase()}`);
  };

  return (
    <div className="search-box" ref={searchRef}>
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Tìm kiếm coin..."
        value={searchQuery}
        onFocus={() => setShowDropdown(true)}
        onChange={e => {
          setSearchQuery(e.target.value);
          setShowDropdown(true);
          if (onSearch) onSearch(e.target.value);
        }}
        className="search-input"
      />

      {showDropdown && searchQuery && (
        <div className="search-dropdown">
          {searchResults.length > 0 ? (
            searchResults.map(coin => (
              <div
                key={coin.symbol}
                className="search-result-item"
                onClick={() => handleSelectCoin(coin.symbol)}
              >
                <img
                  src={getCoinLogo(coin.symbol)}
                  alt={coin.symbol}
                  className="result-logo"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="result-info">
                  <span className="result-symbol">{coin.symbol}</span>
                  <span className="result-name">{getCoinName(coin.symbol)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  );
}
