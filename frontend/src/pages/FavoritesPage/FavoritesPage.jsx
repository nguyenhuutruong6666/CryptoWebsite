import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CoinTable from '../../components/CoinTable/CoinTable';
import Footer from '../../components/Footer/Footer';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../store/AuthContext';
import './FavoritesPage.scss';

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteSymbols, setFavoriteSymbols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchFavorites = async () => {
      const res = await favoriteService.getFavorites();
      if (res.success) {
        setFavoriteSymbols(res.data.map(f => f.symbol));
      }
      setIsLoading(false);
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="favorites-page">
      <Navbar onSearch={setSearchQuery} />

      <main className="favorites-main">
        <div className="favorites-header">
          <h1>Danh sách Yêu thích</h1>
          <p>Theo dõi các đồng coin bạn quan tâm nhất</p>
        </div>
        
        {!user ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>Vui lòng đăng nhập để xem danh sách yêu thích của bạn.</p>
          </div>
        ) : isLoading ? (
          <div className="spinner" style={{ margin: '40px auto' }} />
        ) : (
          <CoinTable 
            searchQuery={searchQuery} 
            activeFilter="all" 
            favoriteSymbols={favoriteSymbols.length > 0 ? favoriteSymbols : ['NO_FAVORITES']} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
