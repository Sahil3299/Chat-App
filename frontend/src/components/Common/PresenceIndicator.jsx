import React from 'react';

const PresenceIndicator = ({ status }) => {
  const statusColor = {
    online: 'bg-green-400',
    away: 'bg-yellow-400',
    offline: 'bg-gray-500'
  };

  return (
    <span className={`w-3 h-3 rounded-full ${statusColor[status] || 'bg-gray-500'}`} />
  );
};

export default PresenceIndicator;
