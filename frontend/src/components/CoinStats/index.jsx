import { formatNumber, formatPrice, formatPercent } from '../../utils/formatters';
import './CoinStats.scss';

export default function CoinStats({ coin }) {
  if (!coin) return null;

  const stats = [
    { label: '24h High', value: formatPrice(coin.high24h), color: 'green' },
    { label: '24h Low', value: formatPrice(coin.low24h), color: 'red' },
    { label: 'Khối lượng 24h', value: formatNumber(coin.volume24h), color: 'primary' },
    { label: 'Vốn hóa TT', value: formatNumber(coin.marketCap), color: 'primary' },
    { label: 'Thay đổi 24h', value: formatPercent(coin.change24h), color: coin.change24h >= 0 ? 'green' : 'red' },
    { label: 'Giá hiện tại', value: formatPrice(coin.price), color: 'yellow' },
  ];

  return (
    <div className="coin-stats-container">
      <h3 className="coin-stats-title">Thông tin chi tiết</h3>
      <div className="coin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className={`stat-value ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
