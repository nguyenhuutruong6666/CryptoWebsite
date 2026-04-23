import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMarket } from '../../store/MarketContext';
import { getCoinLogo, getCoinColor, getCoinName } from '../../utils/coinHelpers';
import { formatNumber, formatPrice } from '../../utils/formatters';
import Pagination from '../Common/Pagination';
import './CoinTable.scss';

const PRIORITY_COINS = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'USDC', 'SOL', 'ADA', 'DOGE', 'MATIC'];

// Đồng bộ logic với MarketOverview — mỗi category lấy 10 coin
const POPULAR_COINS = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC', 'AVAX', 'LTC'];

function getCategoryCoins(markets, filter) {
  switch (filter) {
    case 'popular': {
      const result = [];
      POPULAR_COINS.forEach(sym => {
        const coin = markets.find(c => c.symbol === sym);
        if (coin) result.push(coin);
      });
      return result; // tối đa 10
    }
    case 'new':
      return markets.slice(10, 20); // đồng bộ với MarketOverview (slice 10)
    case 'gainers':
      return [...markets].filter(c => c.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 10);
    case 'volume':
      return [...markets].sort((a, b) => b.volume24h - a.volume24h).slice(0, 10);
    default:
      return null; // null = dùng toàn bộ markets
  }
}

export default function CoinTable({ searchQuery = '', activeFilter = 'all', favoriteSymbols = null }) {
  const { markets, isConnected } = useMarket();
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');
  const [flashingCells, setFlashingCells] = useState(new Set());
  const prevPricesRef = useRef(new Map());

  useEffect(() => {
    const newFlashing = new Set();
    markets.forEach(coin => {
      const prev = prevPricesRef.current.get(coin.symbol);
      if (prev !== undefined && prev !== coin.price) {
        newFlashing.add(`${coin.symbol}-${coin.price > prev ? 'up' : 'down'}`);
      }
      prevPricesRef.current.set(coin.symbol, coin.price);
    });

    if (newFlashing.size > 0) {
      setFlashingCells(newFlashing);
      setTimeout(() => setFlashingCells(new Set()), 500);
    }
  }, [markets]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ col }) => (
    <span className="sort-icon">
      {sortBy === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  const categoryCoins = getCategoryCoins(markets, activeFilter);
  const baseList = categoryCoins ?? markets;

  const filteredMarkets = baseList.filter(coin => {
    if (favoriteSymbols && !favoriteSymbols.includes(coin.symbol)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return coin.symbol.toLowerCase().includes(q) || getCoinName(coin.symbol).toLowerCase().includes(q);
    }
    return true;
  });

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    // Khi đang ở category filter → giữ nguyên thứ tự category đã xác định
    if (activeFilter !== 'all') {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'change') { aVal = a.change24h; bVal = b.change24h; }
      else if (sortBy === 'volume') { aVal = a.volume24h; bVal = b.volume24h; }
      else if (sortBy === 'marketCap') { aVal = a.marketCap; bVal = b.marketCap; }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }

    // Tất cả: ưu tiên PRIORITY_COINS trước
    const aPri = PRIORITY_COINS.indexOf(a.symbol);
    const bPri = PRIORITY_COINS.indexOf(b.symbol);
    if (aPri !== -1 && bPri !== -1) return aPri - bPri;
    if (aPri !== -1) return -1;
    if (bPri !== -1) return 1;

    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'change') {
      aVal = parseFloat(a.priceChangePercent);
      bVal = parseFloat(b.priceChangePercent);
    } else if (sortBy === 'volume') {
      aVal = parseFloat(a.quoteVolume);
      bVal = parseFloat(b.quoteVolume);
    } else if (sortBy === 'marketCap') {
      aVal = parseFloat(a.price) * parseFloat(a.volume);
      bVal = parseFloat(b.price) * parseFloat(b.volume);
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const isCategoryFilter = activeFilter !== 'all';

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortBy, sortOrder]);

  // Category filters đã giới hạn 10 coin — không cần phân trang
  const totalPages = isCategoryFilter ? 1 : Math.ceil(sortedMarkets.length / ITEMS_PER_PAGE);
  const currentData = isCategoryFilter
    ? sortedMarkets
    : sortedMarkets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="coin-table-container">
      <div className="coin-table-header">
        <h2 className="coin-table-title">Thị trường Crypto</h2>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Live' : '○ Đang kết nối...'}
          </span>
        </div>
      </div>

      <div className="coin-table-wrapper">
        <table className="coin-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('name')} className="sortable">
                Tên <SortIcon col="name" />
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Giá <SortIcon col="price" />
              </th>
              <th onClick={() => handleSort('change')} className="sortable">
                24h% <SortIcon col="change" />
              </th>
              <th onClick={() => handleSort('volume')} className="sortable">
                KL 24h <SortIcon col="volume" />
              </th>
              <th onClick={() => handleSort('marketCap')} className="sortable">
                Vốn hóa TT <SortIcon col="marketCap" />
              </th>
              <th>7d Chart</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((coin, index) => {
              const flashClass = flashingCells.has(`${coin.symbol}-up`)
                ? 'flash-green'
                : flashingCells.has(`${coin.symbol}-down`)
                ? 'flash-red'
                : '';

              return (
                <tr key={coin.symbol} className={`coin-row ${flashClass}`}>
                  <td className="rank-cell">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="name-cell">
                    <Link to={`/coin/${coin.symbol.toLowerCase()}`} className="coin-link">
                      <div
                        className="coin-icon-wrapper"
                        style={{ backgroundColor: getCoinColor(coin.symbol) + '20', border: `1px solid ${getCoinColor(coin.symbol)}40` }}
                      >
                        <img
                          src={getCoinLogo(coin.symbol)}
                          alt={coin.symbol}
                          className="coin-logo"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div className="coin-name-info">
                        <span className="coin-symbol">{coin.symbol}</span>
                        <span className="coin-fullname">{getCoinName(coin.symbol)}</span>
                      </div>
                    </Link>
                  </td>
                  <td className={`price-cell ${flashClass}`}>
                    <div className="price-main">
                      {formatPrice(coin.price)}
                    </div>
                  </td>
                  <td className={`change-cell ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                    <span className={`change-badge ${coin.change24h >= 0 ? 'up' : 'down'}`}>
                      {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="volume-cell">{formatNumber(coin.volume24h)}</td>
                  <td className="marketcap-cell">{formatNumber(coin.marketCap)}</td>
                  <td className="chart-cell">
                    <MiniSparkline positive={coin.change24h >= 0} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {markets.length === 0 && (
          <div className="empty-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu cryptocurrency...</p>
          </div>
        )}
      </div>

      {!isCategoryFilter && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

function MiniSparkline({ positive }) {
  const color = positive ? '#0ECB81' : '#F6465D';
  const points = positive
    ? "0,20 10,18 20,15 30,16 40,12 50,10 60,8"
    : "0,8 10,10 20,12 30,11 40,15 50,17 60,20";

  return (
    <svg width="60" height="28" className="sparkline">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
