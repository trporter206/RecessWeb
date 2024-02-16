import React, { useState, useContext, useEffect } from 'react';
import { Location } from '../../models/Location';
import { GameCreationModal } from '../Game Components/GameCreationModal';
import { UserContext } from '../../services/UserContext';
import { useNavigate } from 'react-router-dom';
import { GamesList } from '../Game Components/GamesList';
import { DataContext } from '../../services/DataProvider';
import { addToFavoriteLocations, removeFromFavoriteLocations } from '../../services/UserServices';
import { Favorite, FavoriteBorder, SportsTennis, LightbulbOutlined, EmojiEventsOutlined  } from '@mui/icons-material';

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description, isOwned, owners } = location;
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const profile = userContext ? userContext.profile : null;
  const navigate = useNavigate();
  const { games } = useContext(DataContext);
  const [showGameCreation, setShowGameCreation] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const userIsOwner = user && isOwned && owners.includes(user.uid);

  useEffect(() => {
    const checkIfFavorite = () => {
      const favoriteLocations = profile?.favoriteLocations ?? [];
      setIsFavorite(favoriteLocations.includes(location.id));
    };
  
    checkIfFavorite();
  }, [user, profile, location.id]);

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
    <div className="modal-backdrop">
      <div className="locationInfoModal-content">
        <h3>{name}</h3>
        <div className='location-stats'>
        {isFavorite ? 
          <Favorite onClick={handleToggleFavorite} style={{color: 'green'}}>
            </Favorite>
          : 
          <FavoriteBorder onClick={handleToggleFavorite} style={{color: 'green'}}>
            </FavoriteBorder>
          }
          <div className='location-stats-item'>
            <EmojiEventsOutlined/>
            <h3>{location.totalGames}</h3>
          </div>
          <div className='location-stats-item'>
            <SportsTennis/>
            <h3>{location.courtCount}</h3>
          </div>
          <div className='location-stats-item'>
            <LightbulbOutlined/>
            <h3>{location.lights ? "Yes" : "No"}</h3>
          </div>
        </div>
        <p>{description}</p>
        <GamesList games={gamesAtLocation} onDeleteGame={() => {}} includePending={false}/>
        {(!isOwned || userIsOwner) ? (
          <button onClick={handleOpenGameCreation}>Create Game at this Location</button>
        ) : (
          <p>only this location's owners can start a game</p>
        )}
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
