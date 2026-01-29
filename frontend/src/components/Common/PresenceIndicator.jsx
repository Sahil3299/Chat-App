import React from 'react';
import './PresenceIndicator.css';

const PresenceIndicator = ({ status }) => {
  return (
    <span className={`presence-indicator presence-${status}`} />
  );
};

export default PresenceIndicator;
