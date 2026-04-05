import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { getHistoricalPrices } from '../services/marketService';

export function usePriceHistory(symbol, timeframe = '1h') {
  const { markets } = useWebSocket();
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevPriceRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Fetch lịch sử khi symbol hoặc timeframe thay đổi
  useEffect(() => {
    if (!symbol) return;

    async function fetchHistory() {
      try {
        setIsLoading(true);
        const response = await getHistoricalPrices(symbol, timeframe);
        if (response.success) {
          setPriceHistory(response.data);
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
        setPriceHistory([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
    prevPriceRef.current = null;
    lastUpdateRef.current = 0;
  }, [symbol, timeframe]);

  // Append real-time point chỉ với timeframe 1h
  useEffect(() => {
    if (timeframe !== '1h' || isLoading) return;

    const coin = markets.find(m => m.symbol === symbol);
    const now = Date.now();

    if (coin && coin.price !== prevPriceRef.current && now - lastUpdateRef.current >= 1000) {
      const timeStr = new Date(now).toLocaleTimeString('vi-VN', {
        hour12: false, hour: '2-digit', minute: '2-digit'
      });

      setPriceHistory(prev => {
        const newPoint = { timestamp: now, price: coin.price, time: timeStr };
        const updated = [...prev, newPoint];
        return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
      });

      prevPriceRef.current = coin.price;
      lastUpdateRef.current = now;
    }
  }, [markets, symbol, timeframe, isLoading]);

  return { priceHistory, isLoading };
}
