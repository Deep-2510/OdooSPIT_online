import React from 'react';

const SearchFilters = ({ filters, onToggle }) => {
  return (
    <div className="search-filters">
      {filters?.map((f) => (
        <button key={f.id} onClick={() => onToggle(f.id)}>
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default SearchFilters;
