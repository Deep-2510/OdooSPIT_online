import React from 'react';

const TemplateDownload = ({ templateUrl, label = 'Download Template' }) => (
  <a href={templateUrl} download>
    <button>{label}</button>
  </a>
);

export default TemplateDownload;
