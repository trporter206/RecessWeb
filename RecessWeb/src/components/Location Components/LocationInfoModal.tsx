import React, { useState, useContext, useEffect } from 'react';
import { Location } from '../../models/Location';
import { GameCreationModal } from '../Game Components/GameCreationModal';
import { UserContext } from '../../services/UserContext';
import { useNavigate } from 'react-router-dom';
import { GamesList } from '../Game Components/GamesList';
import { DataContext } from '../../services/DataProvider';
import { addToFavoriteLocations, removeFromFavoriteLocations } from '../../services/UserServices';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description } = location;
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const profile = userContext ? userContext.profile : null;
  const navigate = useNavigate();
  const { games } = useContext(DataContext);
  const [showGameCreation, setShowGameCreation] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = () => {
      if (user && profile?.favoriteLocations.includes(location.id)) {
        setIsFavorite(true);
      }
    };

    checkIfFavorite();
  }, [user, location.id]);

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

  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      if (isFavorite) {
        await removeFromFavoriteLocations(location.id);
      } else {
        await addToFavoriteLocations(location.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleCloseGameCreation = () => {
    setShowGameCreation(false);
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="locationInfoModal-content">
        <h3>{name}</h3>
          {isFavorite ? 
          <Favorite onClick={handleToggleFavorite} style={{color: 'green'}}>
            </Favorite>
          : 
          <FavoriteBorder onClick={handleToggleFavorite} style={{color: 'green'}}>
            </FavoriteBorder>
          }
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
