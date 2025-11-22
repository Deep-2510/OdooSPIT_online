import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding: '8px 12px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
};

export default SearchBar;
