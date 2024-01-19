import React, { useState, useContext } from 'react';
import { Location } from '../../models/Location';
import { GameCreationModal } from '../Game Components/GameCreationModal';
import { UserContext } from '../../services/UserContext';
import { useNavigate } from 'react-router-dom';

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description, games } = location;
  const context = useContext(UserContext);
  const user = context?.user;
  const navigate = useNavigate();
  const [showGameCreation, setShowGameCreation] = useState(false);

  const handleOpenGameCreation = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (user) {
      setShowGameCreation(true);
    } else {
      navigate('/profile')
    }
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
        <button onClick={handleOpenGameCreation}>Create Game at this Location</button>
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
