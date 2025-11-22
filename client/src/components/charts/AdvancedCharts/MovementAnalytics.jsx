import React from 'react';

const MovementAnalytics = ({ data }) => (
  <div className="movement-analytics">
    <h4>Movement Analytics</h4>
    <pre>{JSON.stringify(data || {}, null, 2)}</pre>
  </div>
);

export default MovementAnalytics;
