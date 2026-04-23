import { useState } from 'react';
import './FilterTabs.scss';

const FILTER_TAGS = [
  { id: 'all',     label: 'Tất cả' },
  { id: 'popular', label: 'Phổ biến' },
  { id: 'new',     label: 'Niêm yết mới' },
  { id: 'gainers', label: 'Top tăng giá' },
  { id: 'volume',  label: 'Top khối lượng' },
];

export default function FilterTabs({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-tabs-container">
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
