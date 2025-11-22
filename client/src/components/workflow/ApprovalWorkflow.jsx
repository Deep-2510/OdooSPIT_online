import React from 'react';

const ApprovalWorkflow = ({ steps }) => (
  <div className="approval-workflow">
    <h4>Approval Workflow</h4>
    <ol>
      {steps?.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  </div>
);

export default ApprovalWorkflow;
