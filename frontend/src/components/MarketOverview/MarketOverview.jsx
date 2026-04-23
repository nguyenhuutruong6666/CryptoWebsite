import { useMemo } from 'react';
import { useMarket } from '../../store/MarketContext';
import { getCoinLogo, getCoinColor } from '../../utils/coinHelpers';
import './MarketOverview.scss';

function formatPrice(price) {
  if (price < 0.01) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CategoryCard({ title, coins }) {
  return (
    <div className="overview-card">
      <h3 className="overview-card-title">{title}</h3>
      <div className="overview-coin-list">
        {coins.slice(0, 3).map((coin) => (
          <div key={coin.symbol} className="overview-coin-item">
            <div className="overview-coin-info" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="overview-coin-icon-img" style={{
                borderRadius: '16px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getCoinColor(coin.symbol) + '20',
                border: `1px solid ${getCoinColor(coin.symbol)}40`,
                marginRight: '12px',
                overflow: 'hidden'
              }}>
                <img 
                  src={getCoinLogo(coin.symbol)} 
                  alt={coin.symbol} 
                  style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </span>
              <div className="overview-coin-details">
                <span className="overview-coin-symbol">{coin.symbol}</span>
                <span className="overview-coin-price">
                  {formatPrice(coin.price)}
                </span>
              </div>
            </div>
            <span className={`overview-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
              {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketOverview() {
  const { markets } = useMarket();

  const popular = useMemo(() => {
    const targets = ['BNB', 'BTC', 'ETH'];
    return targets.map(s => markets.find(c => c.symbol === s)).filter(Boolean);
  }, [markets]);

  const gainers = useMemo(() => {
    return [...markets].filter(c => c.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  }, [markets]);

  const volume = useMemo(() => {
    return [...markets].sort((a, b) => b.volume24h - a.volume24h).slice(0, 3);
  }, [markets]);

  const newListings = useMemo(() => {
    return markets.slice(10, 13);
  }, [markets]);

  return (
    <div className="market-overview">
      <CategoryCard title="Phổ biến" coins={popular} />
      <CategoryCard title="Niêm yết mới" coins={newListings} />
      <CategoryCard title="Top tăng giá" coins={gainers} />
      <CategoryCard title="Top khối lượng" coins={volume} />
    </div>
  );
}
