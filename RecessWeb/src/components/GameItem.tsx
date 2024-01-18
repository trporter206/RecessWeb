import React, { useState, useContext } from 'react';
import { deleteGame } from '../services/GameServices';
import { LocationsContext } from '../services/LocationsProvider';
import { GameInfoModal } from './GameInfoModal';
import { Game } from '../models/Game';

interface GameItemProps {
  game: Game;
  onDelete: (id: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({ game, onDelete }) => {
  const { id, locationId, players, time } = game;
  const { removeGameFromLocation } = useContext(LocationsContext);
  const [showModal, setShowModal] = useState(false);
    
    const handleToggleModal = () => {
      setShowModal(!showModal);
    };

    const handleDelete = async () => {
      try {
        await deleteGame(id);
        onDelete(id);
        removeGameFromLocation(id, locationId);
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    };

  return (
    <div className='game-item' onClick={handleToggleModal}>
  <h3>{locationId}</h3>
  <div className="game-info">
    <p className="game-date">{time.toDateString()}</p>
    <p className="game-players">{players.length} players</p>
  </div>
  <button onClick={handleDelete}>Delete</button>
  {showModal && (
    <GameInfoModal
      game={game}
      onClose={() => setShowModal(false)}
    />
  )}
</div>

  );
};