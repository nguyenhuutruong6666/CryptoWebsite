import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MarketOverview from '../../components/MarketOverview/MarketOverview';
import FilterTabs from '../../components/FilterTabs/FilterTabs';
import CoinTable from '../../components/CoinTable/CoinTable';
import Footer from '../../components/Footer/Footer';
import './HomePage.scss';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="home-page">
      <Navbar onSearch={setSearchQuery} />

      <main className="home-main">
        <MarketOverview />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <CoinTable searchQuery={searchQuery} activeFilter={activeFilter} />
      </main>
      <Footer />
    </div>
  );
}
