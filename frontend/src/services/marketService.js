import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export async function getAllMarkets() {
  const res = await api.get('/api/markets/all');
  return res.data;
}

export async function getPopularCoins() {
  const res = await api.get('/api/markets/popular');
  return res.data;
}

export async function getTopGainers() {
  const res = await api.get('/api/markets/gainers');
  return res.data;
}

export async function getTopVolume() {
  const res = await api.get('/api/markets/volume');
  return res.data;
}

export async function getNewListings() {
  const res = await api.get('/api/markets/new');
  return res.data;
}

export async function getHistoricalPrices(symbol, timeframe = '1h') {
  const res = await api.get(`/api/markets/history/${symbol}`, {
    params: { timeframe }
  });
  return res.data;
}

export default api;
