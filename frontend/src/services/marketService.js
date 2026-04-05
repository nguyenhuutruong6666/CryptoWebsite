import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/**
 * Lấy tất cả markets
 */
export async function getAllMarkets() {
  const res = await api.get('/api/markets/all');
  return res.data;
}

/**
 * Lấy popular coins
 */
export async function getPopularCoins() {
  const res = await api.get('/api/markets/popular');
  return res.data;
}

/**
 * Lấy top gainers
 */
export async function getTopGainers() {
  const res = await api.get('/api/markets/gainers');
  return res.data;
}

/**
 * Lấy top volume
 */
export async function getTopVolume() {
  const res = await api.get('/api/markets/volume');
  return res.data;
}

/**
 * Lấy new listings
 */
export async function getNewListings() {
  const res = await api.get('/api/markets/new');
  return res.data;
}

/**
 * Lấy historical price data
 * @param {string} symbol - coin symbol (e.g. 'BTC')
 * @param {string} timeframe - '1h' | '1d' | '1w' | '1M' | '1Y'
 */
export async function getHistoricalPrices(symbol, timeframe = '1h') {
  const res = await api.get(`/api/markets/history/${symbol}`, {
    params: { timeframe }
  });
  return res.data;
}

export default api;
