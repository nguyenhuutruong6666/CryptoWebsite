import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../../store/MarketContext';
import { usePriceHistory } from '../../hooks/usePriceHistory';
import Navbar from '../../components/Navbar';
import PriceChart from '../../components/PriceChart';
import CoinStats from '../../components/CoinStats';
import { getCoinLogo, getCoinColor, getCoinName } from '../../utils/coinHelpers';
import { formatPrice, formatPercent } from '../../utils/formatters';
import './CoinDetailPage.scss';

export default function CoinDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1h');

  const { markets, isConnected } = useMarket();
  const { priceHistory, isLoading } = usePriceHistory(symbol?.toUpperCase(), timeframe);

  const coin = markets.find(m => m.symbol === symbol?.toUpperCase());

  if (!coin && markets.length === 0) {
    return (
      <div className="coin-detail-page">
        <Navbar />
        <div className="coin-detail-loading">
          <div className="spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!coin && markets.length > 0) {
    return (
      <div className="coin-detail-page">
        <Navbar />
        <div className="coin-not-found">
          <div className="not-found-icon">🔍</div>
          <h1>Không tìm thấy coin</h1>
          <p>Symbol "<strong>{symbol?.toUpperCase()}</strong>" không tồn tại trong danh sách.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const isPositive = coin?.change24h >= 0;

  return (
    <div className="coin-detail-page">
      <Navbar />

      <main className="coin-detail-main">
        <div className="coin-detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Quay lại
          </button>

          <div className="coin-header-info">
            <div className="coin-header-identity">
              <div
                className="coin-header-icon"
                style={{
                  backgroundColor: getCoinColor(coin?.symbol) + '25',
                  border: `2px solid ${getCoinColor(coin?.symbol)}50`
                }}
              >
                <img
                  src={getCoinLogo(coin?.symbol)}
                  alt={coin?.symbol}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="coin-header-names">
                <h1 className="coin-header-symbol">{coin?.symbol}</h1>
                <span className="coin-header-fullname">{getCoinName(coin?.symbol)}</span>
              </div>
            </div>

            <div className="coin-header-price-section">
              <span className="coin-current-price">
                {formatPrice(coin?.price)}
              </span>
              <span className={`coin-price-change ${isPositive ? 'positive' : 'negative'}`}>
                {formatPercent(coin?.change24h)}
              </span>
              <span className={`live-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '● Live' : '○ Offline'}
              </span>
            </div>
          </div>
        </div>

        <PriceChart
          data={priceHistory}
          symbol={coin?.symbol}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          isLoading={isLoading}
        />

        {coin && <CoinStats coin={coin} />}
      </main>
    </div>
  );
}
