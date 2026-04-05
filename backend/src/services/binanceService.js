const axios = require('axios');

const BINANCE_API_URL = process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3';

// Cache để giảm API calls
let cache = {
  allMarkets: null,
  lastUpdate: null,
  cacheTime: 3000 // 3 seconds
};

// Mapping timeframe to Binance kline intervals
const TIMEFRAME_TO_INTERVAL = {
  '1h': '1m',   // 1 hour: 1-minute candles
  '1d': '5m',   // 1 day: 5-minute candles
  '1w': '1h',   // 1 week: 1-hour candles
  '1M': '4h',   // 1 month: 4-hour candles
  '1Y': '1d'    // 1 year: 1-day candles
};

const TIMEFRAME_TO_LIMIT = {
  '1h': 60,     // 60 minutes
  '1d': 288,    // 24h * 12 (5-min intervals)
  '1w': 168,    // 7 days * 24 hours
  '1M': 180,    // 30 days * 6 (4-hour intervals)
  '1Y': 365     // 365 days
};

/**
 * Fetch tất cả trading pairs từ Binance (top 100 USDT pairs by volume)
 */
async function getAllMarkets() {
  try {
    const now = Date.now();
    if (cache.allMarkets && cache.lastUpdate && (now - cache.lastUpdate < cache.cacheTime)) {
      return cache.allMarkets;
    }

    const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`, { timeout: 10000 });

    const usdtPairs = response.data
      .filter(ticker => ticker.symbol.endsWith('USDT'))
      .map(ticker => ({
        symbol: ticker.symbol.replace('USDT', ''),
        fullSymbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.quoteVolume),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        marketCap: parseFloat(ticker.quoteVolume) * 10
      }))
      .filter(coin => coin.price > 0)
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 100);

    cache.allMarkets = usdtPairs;
    cache.lastUpdate = now;

    return usdtPairs;
  } catch (error) {
    console.error('Error fetching markets from Binance:', error.message);
    return cache.allMarkets || [];
  }
}

/**
 * Lấy popular coins (BNB, BTC, ETH cộng top volume)
 */
async function getPopularCoins() {
  const markets = await getAllMarkets();
  const priorityOrder = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC', 'AVAX', 'LTC'];
  const result = [];

  priorityOrder.forEach(symbol => {
    const coin = markets.find(c => c.symbol === symbol);
    if (coin) result.push(coin);
  });

  return result.slice(0, 10);
}

/**
 * Top gainers (% tăng cao nhất)
 */
async function getTopGainers() {
  const markets = await getAllMarkets();
  return markets
    .filter(coin => coin.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);
}

/**
 * Top volume
 */
async function getTopVolume() {
  const markets = await getAllMarkets();
  return markets.slice(0, 10);
}

/**
 * New listings (giả lập)
 */
async function getNewListings() {
  const markets = await getAllMarkets();
  // Lấy từ index 20-30 để giả lập "mới"
  return markets.slice(20, 30);
}

/**
 * Historical price data từ Binance klines
 */
async function getHistoricalPrices(symbol, timeframe = '1h') {
  try {
    const interval = TIMEFRAME_TO_INTERVAL[timeframe] || '1m';
    const limit = TIMEFRAME_TO_LIMIT[timeframe] || 60;

    const response = await axios.get(`${BINANCE_API_URL}/klines`, {
      params: {
        symbol: `${symbol.toUpperCase()}USDT`,
        interval: interval,
        limit: limit
      },
      timeout: 10000
    });

    const historicalData = response.data.map(kline => {
      const timestamp = kline[0];
      const closePrice = parseFloat(kline[4]);
      return {
        timestamp,
        price: closePrice,
        time: formatTime(timestamp, timeframe)
      };
    });

    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical prices for ${symbol}:`, error.message);
    throw error;
  }
}

function formatTime(timestamp, timeframe) {
  const date = new Date(timestamp);
  switch (timeframe) {
    case '1h':
    case '1d':
      return date.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    case '1w':
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit' });
    case '1M':
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    case '1Y':
      return date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
    default:
      return date.toLocaleTimeString('vi-VN');
  }
}

module.exports = {
  getAllMarkets,
  getPopularCoins,
  getTopGainers,
  getTopVolume,
  getNewListings,
  getHistoricalPrices
};
