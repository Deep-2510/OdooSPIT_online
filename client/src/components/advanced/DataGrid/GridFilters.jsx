import React from 'react';

const GridFilters = ({ filters, onChange }) => {
  return (
    <div className="grid-filters">
      {filters?.map((f) => (
        <div key={f.id}>
          <label>{f.label}</label>
          <input
            value={f.value || ''}
            onChange={(e) => onChange(f.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default GridFilters;
