import React, { useState, useContext } from 'react';
import { Location } from '../../models/Location';
import { GameCreationModal } from '../Game Components/GameCreationModal';
import { UserContext } from '../../services/UserContext';
import { useNavigate } from 'react-router-dom';
import { GamesList } from '../Game Components/GamesList';
import { DataContext } from '../../services/DataProvider';

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description } = location;
  const context = useContext(UserContext);
  const user = context?.user;
  const navigate = useNavigate();
  const { games } = useContext(DataContext);
  const [showGameCreation, setShowGameCreation] = useState(false);

  // Filter games to only show those associated with this location
  const gamesAtLocation = games.filter(game => game.locationId === location.id);

  const handleOpenGameCreation = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (user) {
      setShowGameCreation(true);
    } else {
      navigate('/profile');
    }
  };

  const handleCloseGameCreation = () => {
    setShowGameCreation(false);
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="locationInfoModal-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <GamesList games={gamesAtLocation} onDeleteGame={() => {}} />
        <button onClick={handleOpenGameCreation}>Create Game at this Location</button>
        <button onClick={onClose}>Close</button>
        {showGameCreation && (
          <GameCreationModal
            show={showGameCreation}
            onClose={handleCloseGameCreation}
            locationId={location.id}
          />
        )}
      </div>
    </div>
  );
};
