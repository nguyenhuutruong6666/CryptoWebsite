export function formatNumber(num, decimals = 2) {
  if (!num && num !== 0) return '$0.00';
  if (num >= 1e12) return `$${(num / 1e12).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}T`;
  if (num >= 1e9) return `$${(num / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}B`;
  if (num >= 1e6) return `$${(num / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}M`;
  if (num >= 1e3) return `$${(num / 1e3).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}K`;
  return `$${num.toLocaleString('vi-VN', { maximumFractionDigits: decimals })}`;
}

export function formatCompactNumber(num, decimals = 2) {
  if (!num && num !== 0) return '0';
  if (num >= 1e12) return `${(num / 1e12).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}T`;
  if (num >= 1e9) return `${(num / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}B`;
  if (num >= 1e6) return `${(num / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}M`;
  if (num >= 1e3) return `${(num / 1e3).toLocaleString('vi-VN', { maximumFractionDigits: decimals })}K`;
  return num.toLocaleString('vi-VN', { maximumFractionDigits: decimals });
}

export function formatPrice(price) {
  if (!price) return '$0.00';
  const decimals = price < 1 ? (price < 0.001 ? 8 : 4) : 2;
  return `$${price.toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })}`;
}

export function formatPercent(change, withSign = true) {
  if (change === undefined || change === null) return '0,00%';
  const sign = withSign && change >= 0 ? '+' : '';
  return `${sign}${change.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatTime(timestamp, timeframe = '1h') {
  const date = new Date(timestamp);
  switch (timeframe) {
    case '1h':
    case '1d':
      return date.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    case '1w':
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    case '1M':
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    case '1Y':
      return date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
    default:
      return date.toLocaleTimeString('vi-VN');
  }
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
