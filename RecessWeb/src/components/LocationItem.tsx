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
      <div className='location-content'>
        <h3>{location.name}</h3>
        <span className="game-count">{location.games.length} {location.games.length === 1 ? 'game' : 'games'}</span>
      </div>
      {showInfo && (
        <LocationInfoModal 
          location={location} 
          onClose={() => setShowInfo(false)} 
        />
      )}
    </div>
  );
};
