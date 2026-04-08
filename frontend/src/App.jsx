import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MarketProvider } from './store/MarketContext';
import HomePage from './pages/HomePage';
import CoinDetailPage from './pages/CoinDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coin/:symbol" element={<CoinDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </MarketProvider>
    </BrowserRouter>
  );
}

export default App;
