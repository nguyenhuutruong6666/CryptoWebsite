import { useState } from 'react';
import Navbar from '../../components/Navbar';
import CoinTable from '../../components/CoinTable';
import './FavoritesPage.scss';

// Mock danh sách coin yêu thích
const FAVORITE_COINS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="favorites-page">
      <Navbar onSearch={setSearchQuery} />

      <main className="favorites-main">
        <div className="favorites-header">
          <h1>Danh sách Yêu thích</h1>
          <p>Theo dõi các đồng coin bạn quan tâm nhất</p>
        </div>
        <CoinTable searchQuery={searchQuery} activeFilter="all" favoriteSymbols={FAVORITE_COINS} />
      </main>
    </div>
  );
}
