import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../../store/MarketContext';
import { usePriceHistory } from '../../hooks/usePriceHistory';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../store/ToastContext';
import { favoriteService } from '../../services/favoriteService';
import Navbar from '../../components/Navbar/Navbar';
import PriceChart from '../../components/PriceChart/PriceChart';
import CoinStats from '../../components/CoinStats/CoinStats';
import { getCoinLogo, getCoinColor, getCoinName } from '../../utils/coinHelpers';
import { formatPrice, formatPercent } from '../../utils/formatters';
import './CoinDetailPage.scss';

export default function CoinDetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1h');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToast();

  const { markets, isConnected } = useMarket();
  const { priceHistory, isLoading } = usePriceHistory(symbol?.toUpperCase(), timeframe);

  const coin = markets.find(m => m.symbol === symbol?.toUpperCase());

  useEffect(() => {
    if (user && symbol) {
      favoriteService.checkFavorite(symbol).then(res => {
        if (res.success) setIsFavorited(res.isFavorited);
      });
    }
  }, [user, symbol]);

  const handleToggleFavorite = async () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
      return navigate('/login');
    }
    
    setIsToggling(true);
    const res = await favoriteService.toggleFavorite(symbol);
    setIsToggling(false);
    
    if (res.success) {
      setIsFavorited(res.isFavorited);
      addToast(res.message, 'success');
    } else {
      addToast(res.message || 'Có lỗi xảy ra', 'error');
    }
  };

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 className="coin-header-symbol">{coin?.symbol}</h1>
                  <button 
                    onClick={handleToggleFavorite}
                    disabled={isToggling}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isFavorited ? '#f6465d' : '#666',
                      transition: 'transform 0.2s, color 0.2s',
                      transform: isToggling ? 'scale(0.9)' : 'scale(1)',
                      padding: '4px', display: 'flex'
                    }}
                    title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
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
