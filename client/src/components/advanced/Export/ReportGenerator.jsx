import React from 'react';

const ReportGenerator = ({ onGenerate }) => {
  return (
    <div className="report-generator">
      <button onClick={onGenerate}>Generate Report</button>
    </div>
  );
};

export default ReportGenerator;
