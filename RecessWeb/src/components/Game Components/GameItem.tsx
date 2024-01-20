import React, { useState, useContext, useEffect } from 'react';
import { deleteGame } from '../../services/GameServices';
import { LocationsContext } from '../../services/LocationsProvider';
import { UserContext } from '../../services/UserContext';
import { GameInfoModal } from './GameInfoModal';
import { Game } from '../../models/Game';
import { fetchUsernameById } from '../../services/UserServices'; // Import your fetchUsernameById function

interface GameItemProps {
  game: Game;
  onDelete: (id: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({ game, onDelete }) => {
  const { id, locationId, players, time, hostId } = game;
  const { locations } = useContext(LocationsContext);
  const removeGameFromLocation = useContext(LocationsContext).removeGameFromLocation;
  const userContext = useContext(UserContext);
  const [hostUsername, setHostUsername] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch host username
    const loadHostUsername = async () => {
      const username = await fetchUsernameById(hostId);
      setHostUsername(username);
    };

    loadHostUsername();

    // Fetch location name
    const location = locations.find(loc => loc.id === locationId);
    setLocationName(location ? location.name : locationId);
  }, [hostId, locationId, locations]);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDelete = async () => {
    if (userContext?.user?.uid === hostId) {
      try {
        await deleteGame(id);
        onDelete(id);
        removeGameFromLocation(id, locationId);
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  return (
    <div className='game-item' onClick={handleToggleModal}>
      <h3>{locationName}</h3>
      <div className="game-info">
        <p className="game-host">{hostUsername}</p>
        <p className="game-date">{time.toDateString()}</p>
        <p className="game-players">{players.length} players</p>
      </div>
      {userContext?.user?.uid === hostId && (
        <button onClick={handleDelete}>Delete</button>
      )}
      {showModal && (
        <GameInfoModal
          game={game}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
