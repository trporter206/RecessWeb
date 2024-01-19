// gameInfoModal component
import React from 'react';
import { Game } from '../../models/Game'; // Import the game type

interface GameInfoModalProps {
  game: Game;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, onClose }) => {

  return (
    <div className="InfoModal-backdrop">
      <div className="gameInfoModal-content">
        <h3>{game.locationId}</h3>
        <p>Players: {game.players.length}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
