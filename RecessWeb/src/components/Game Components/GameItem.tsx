import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../services/DataProvider';
import { UserContext } from '../../services/UserContext';
import { GameInfoModal } from './GameInfoModal';
import { Game } from '../../models/Game';
import { deleteGame } from '../../services/GameServices';

interface GameItemProps {
  game: Game;
  onDelete: (id: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({ game, onDelete }) => {
  const { id, locationId, players, date, hostId, minimumPoints, isTeamGame, title } = game;
  const removeGameFromLocation = useContext(DataContext).removeGameFromLocation;
  const userContext = useContext(UserContext);
  const [hostUsername, setHostUsername] = useState('');
  const [locationName, setLocationName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { removeGame, locations, users } = useContext(DataContext);
  const { user } = useContext(UserContext);

  let displayDate = '';
  if (date instanceof Date) {
    displayDate = date.toDateString();
  } else {
    console.error('Invalid date object:', date);
  }

  useEffect(() => {
    // Fetch host username
    const hostUser = users.find(user => user.id === hostId);
    setHostUsername(hostUser ? hostUser.username : 'Unknown Host');
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
      <h2>{title}</h2>
      <p className="game-host">Host: {hostUsername}</p>
      <p className="game-date">{displayDate}</p>
      {isTeamGame && (
        <p className="game-host">Open Team Invite</p>
      )}
      {!isTeamGame && (
        <div className='game-stats'>
          <p className="game-host">Minimum: {minimumPoints}</p>
          <p className="game-players"> {players.length} players</p>
        </div>
      )}
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
