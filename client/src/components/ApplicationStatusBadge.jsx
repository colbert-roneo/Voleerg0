import React from 'react';

const ApplicationStatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'applied';
  
  return (
    <span className={`badge badge-${normalizedStatus}`}>
      {status}
    </span>
  );
};

export default ApplicationStatusBadge;
