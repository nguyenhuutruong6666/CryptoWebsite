import { useState } from 'react';
import Navbar from '../../components/Navbar';
import MarketOverview from '../../components/MarketOverview';
import FilterTabs from '../../components/FilterTabs';
import CoinTable from '../../components/CoinTable';
import './HomePage.scss';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="home-page">
      <Navbar onSearch={setSearchQuery} />

      <main className="home-main">
        {/* Market Overview Cards */}
        <MarketOverview />

        {/* Filter Tabs */}
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Coin Table */}
        <CoinTable searchQuery={searchQuery} activeFilter={activeFilter} />
      </main>
    </div>
  );
}
