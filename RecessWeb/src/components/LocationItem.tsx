// LocationItem component
import React, { useState } from 'react';
import { Location } from '../models/Location';
import { LocationInfoModal } from './LocationInfoModal';

export const LocationItem: React.FC<{ location: Location }> = ({ location }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className='location-item' onClick={handleToggleInfo}>
      <h3>{location.name}</h3>
      {showInfo && (
        <LocationInfoModal location={location} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
};
