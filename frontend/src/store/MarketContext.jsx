import { createContext, useContext } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const MarketContext = createContext(null);

export function MarketProvider({ children }) {
  const { markets, isConnected, lastUpdate, socket } = useWebSocket();

  return (
    <MarketContext.Provider value={{ markets, isConnected, lastUpdate, socket }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within MarketProvider');
  }
  return context;
}
