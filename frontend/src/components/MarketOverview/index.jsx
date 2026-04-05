import { useMemo } from 'react';
import { useMarket } from '../../store/MarketContext';
import './MarketOverview.scss';

const COIN_ICONS = {
  BNB: '🟡', BTC: '🟠', ETH: '🔵', USDC: '🔵',
  USDT: '🟢', SOL: '🟣', ADA: '🔵', XRP: '⚪', DOGE: '🐕',
};

function getCoinIcon(symbol) {
  return COIN_ICONS[symbol] || '💰';
}

function formatPrice(price) {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CategoryCard({ title, coins, showIcons = false }) {
  return (
    <div className="overview-card">
      <h3 className="overview-card-title">{title}</h3>
      <div className="overview-coin-list">
        {coins.slice(0, 3).map((coin) => (
          <div key={coin.symbol} className="overview-coin-item">
            <div className="overview-coin-info">
              {showIcons && (
                <span className="overview-coin-icon">{getCoinIcon(coin.symbol)}</span>
              )}
              <div className="overview-coin-details">
                <span className="overview-coin-symbol">{coin.symbol}</span>
                <span className="overview-coin-price">
                  {showIcons
                    ? formatPrice(coin.price)
                    : `$${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                  }
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
    return markets.slice(20, 23);
  }, [markets]);

  return (
    <div className="market-overview">
      <CategoryCard title="Phổ biến" coins={popular} showIcons />
      <CategoryCard title="Niêm yết mới" coins={newListings} />
      <CategoryCard title="Top tăng giá" coins={gainers} />
      <CategoryCard title="Top khối lượng" coins={volume} />
    </div>
  );
}
