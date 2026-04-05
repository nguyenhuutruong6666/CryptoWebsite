import { useState } from 'react';
import './FilterTabs.scss';

const MAIN_TABS = [
  { id: 'favorites', label: '⭐ Yêu thích' },
  { id: 'crypto', label: 'Tiền mã hóa' },
  { id: 'spot', label: 'Giao ngay' },
  { id: 'futures', label: 'Hợp đồng tương lai' },
];

const FILTER_TAGS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'bnb', label: 'BNB Chain' },
  { id: 'sol', label: 'Solana' },
  { id: 'rwa', label: 'RWA' },
  { id: 'meme', label: 'Meme' },
  { id: 'ai', label: 'AI' },
  { id: 'layer1', label: 'Layer 1' },
  { id: 'layer2', label: 'Layer 2' },
  { id: 'defi', label: 'DeFi' },
  { id: 'gaming', label: 'Gaming' },
];

export default function FilterTabs({ activeFilter, onFilterChange }) {
  const [activeMainTab, setActiveMainTab] = useState('crypto');

  return (
    <div className="filter-tabs-container">
      <div className="filter-main-tabs">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.id}
            className={`filter-main-tab ${activeMainTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveMainTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="filter-tags">
        {FILTER_TAGS.map(filter => (
          <button
            key={filter.id}
            className={`filter-tag ${(activeFilter || 'all') === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange?.(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
