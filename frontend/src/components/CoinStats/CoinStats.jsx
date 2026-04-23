import { formatNumber, formatCompactNumber, formatPrice, formatPercent } from '../../utils/formatters';
import './CoinStats.scss';

const getMockData = (symbol, currentPrice) => {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i);

  let dom = symbol === 'BTC' ? 52.34 : (symbol === 'ETH' ? 17.5 : (seed % 5) + 0.5);
  let maxSupply = symbol === 'BTC' ? 21000000 : (seed * 10000000);
  let circulatingSupply = maxSupply * (0.8 + (seed % 15) / 100);
  let totalSupply = maxSupply * 0.95;

  let year = 2013 + (seed % 10);
  let month = String((seed % 12) + 1).padStart(2, '0');
  let day = String((seed % 28) + 1).padStart(2, '0');
  let issueDate = symbol === 'BTC' ? '2009-01-03' : `${year}-${month}-${day}`;

  let ath = currentPrice * (1.2 + (seed % 4));
  let atl = currentPrice * (0.01 + (seed % 10) / 100);

  return { dom, maxSupply, circulatingSupply, totalSupply, issueDate, ath, atl, athDate: `${year + 2}-10-07`, atlDate: `${year + 1}-07-15` };
};

export default function CoinStats({ coin }) {
  if (!coin) return null;

  const price = parseFloat(coin.price);
  const quoteVolume = parseFloat(coin.quoteVolume);
  const { dom, maxSupply, circulatingSupply, totalSupply, issueDate, ath, atl, athDate, atlDate } = getMockData(coin.symbol, price);

  const marketCap = price * circulatingSupply;
  const fdv = price * maxSupply;
  const volToMc = (quoteVolume / marketCap) * 100;
  const density = ((seed) => ((seed % 100) / 100).toLocaleString('vi-VN', { minimumFractionDigits: 2 }))(coin.symbol.charCodeAt(0));

  const stats = [
    { label: 'Vốn hoá thị trường', value: formatNumber(marketCap) },
    { label: 'Vốn hóa thị trường được pha...', value: formatNumber(fdv) },
    { label: 'Tỷ lệ thống trị thị trường', value: formatPercent(dom, false) },
    { label: 'Khối lượng', value: formatNumber(quoteVolume) },
    { label: 'Khối lượng/Vốn hóa thị trường', value: formatPercent(volToMc, false) },
    { label: 'Tổng cung lưu hành', value: `${formatCompactNumber(circulatingSupply)} ${coin.symbol}` },
    { label: 'Tổng cung tối đa', value: `${formatCompactNumber(maxSupply)} ${coin.symbol}` },
    { label: 'Tổng cung', value: `${formatCompactNumber(totalSupply)} ${coin.symbol}` },
    { label: 'Mật độ nền tảng', value: density },
    { label: 'Ngày phát hành', value: issueDate },
    { label: 'Mức cao nhất mọi thời đại', value: formatPrice(ath), subValue: athDate },
    { label: 'Thấp nhất mọi thời đại', value: formatPrice(atl), subValue: atlDate },
  ];

  return (
    <div className="coin-stats-container">
      <h3 className="coin-stats-title">Thông tin chi tiết</h3>
      <div className="coin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-label-container">
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{stat.value}</span>
              {stat.subValue && <span className="stat-subvalue">{stat.subValue}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
