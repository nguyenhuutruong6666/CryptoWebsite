import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MarketProvider } from './store/MarketContext';
import HomePage from './pages/HomePage';
import CoinDetailPage from './pages/CoinDetailPage';

function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coin/:symbol" element={<CoinDetailPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </MarketProvider>
    </BrowserRouter>
  );
}

export default App;
