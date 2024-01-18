// LocationInfoModal component
import React, { useState } from 'react';
import { Location } from '../models/Location';
import { GameCreationModal } from './GameCreationModal'; // Import the GameCreationModal

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description, games } = location;
  const [showGameCreation, setShowGameCreation] = useState(false);

  const handleOpenGameCreation = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowGameCreation(true);
  };

  const handleCloseGameCreation = () => {
    setShowGameCreation(false);
  };

  const handleGameCreated = () => {
    setShowGameCreation(false);
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="locationInfoModal-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <ul>
          {games.map(game => (
            <li key={game.toString()}>{game}</li>
          ))}
        </ul>
        <button onClick={(event) => handleOpenGameCreation(event)}>Create Game at this Location</button>
        <button onClick={onClose}>Close</button>

        {showGameCreation && (
          <GameCreationModal
            show={showGameCreation}
            onClose={handleCloseGameCreation}
            onGameCreated={handleGameCreated}
            locationId={location.id}
          />
        )}
      </div>
    </div>
  );
};
