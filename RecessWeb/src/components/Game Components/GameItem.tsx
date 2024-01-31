import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../services/DataProvider';
import { UserContext } from '../../services/UserContext';
import { GameInfoModal } from './GameInfoModal';
import { Game } from '../../models/Game';
import { fetchUsernameById } from '../../services/UserServices';
import { deleteGame } from '../../services/GameServices';

interface GameItemProps {
  game: Game;
  onDelete: (id: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({ game, onDelete }) => {
  const { id, locationId, players, time, hostId, minimumPoints } = game;
  const { locations } = useContext(DataContext);
  const removeGameFromLocation = useContext(DataContext).removeGameFromLocation;
  const userContext = useContext(UserContext);
  const [hostUsername, setHostUsername] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { removeGame } = useContext(DataContext);
  const { user } = useContext(UserContext);

  let displayDate = '';
  if (time instanceof Date) {
    displayDate = time.toDateString();
  } else {
    console.error('Invalid date object:', time);
  }

  useEffect(() => {
    // Fetch host username
    const loadHostUsername = async () => {
      const username = await fetchUsernameById(hostId);
      setHostUsername(username[0]);
    };

    loadHostUsername();

    // Fetch location name
    const location = locations.find(loc => loc.id === locationId);
    setLocationName(location ? location.name : 'Unknown Location');
  }, [hostId, locationId, locations]);

  const handleToggleModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowModal(!showModal);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (user?.uid === hostId) {
      const confirmDelete = window.confirm('Are you sure you want to delete this game?');
      if (confirmDelete) {
        try {
          await deleteGame(id, removeGame);
          removeGameFromLocation(id, locationId);
          onDelete(game.id);
        } catch (error) {
          console.error('Error deleting game:', error);
        }
      }
    }
  };

  return (
    <div className='game-item' onClick={handleToggleModal}>
      <h3>{locationName}</h3>
      <p className="game-host">Host: {hostUsername}</p>
      <p className="game-host">Minimum: {minimumPoints}</p>
      <div className="game-info">
        <p className="game-date">{displayDate}</p>
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
