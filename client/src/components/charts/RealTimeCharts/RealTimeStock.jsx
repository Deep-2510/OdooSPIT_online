import React from 'react';

const RealTimeStock = ({ stream }) => {
  return (
    <div className="real-time-stock">
      <h4>Real Time Stock</h4>
      <p>Streaming source: {stream}</p>
    </div>
  );
};

export default RealTimeStock;
