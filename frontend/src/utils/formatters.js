export function formatNumber(num, decimals = 2) {
  if (!num && num !== 0) return '$0.00';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
  return `$${num.toFixed(decimals)}`;
}

export function formatPrice(price) {
  if (!price) return '$0.00';
  const decimals = price < 1 ? 8 : 2;
  return `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })}`;
}

export function formatPercent(change) {
  if (change === undefined || change === null) return '0.00%';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
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
