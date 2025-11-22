import React from 'react';

const ExportButton = ({ onExport, label = 'Export' }) => (
  <button onClick={onExport}>{label}</button>
);

export default ExportButton;
