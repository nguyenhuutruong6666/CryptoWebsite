const axios = require('axios');

const BINANCE_API_URL = process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3';

let cache = {
  allMarkets: null,
  lastUpdate: null,
  cacheTime: 3000
};

const TIMEFRAME_TO_INTERVAL = {
  '1h': '1m',
  '1d': '5m',
  '1w': '1h',
  '1M': '4h',
  '1Y': '1d'
};

const TIMEFRAME_TO_LIMIT = {
  '1h': 60,
  '1d': 288,
  '1w': 168,
  '1M': 180,
  '1Y': 365
};

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

async function getTopGainers() {
  const markets = await getAllMarkets();
  return markets
    .filter(coin => coin.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);
}

async function getTopVolume() {
  const markets = await getAllMarkets();
  return markets.slice(0, 10);
}

async function getNewListings() {
  const markets = await getAllMarkets();
  return markets.slice(20, 30);
}

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
