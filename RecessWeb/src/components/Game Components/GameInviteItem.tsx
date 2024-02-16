import React, { useState } from 'react';
import { GameInfoModal } from './GameInfoModal';
import { Game } from '../../models/Game';

interface GameInviteItemProps {
  game: Game;
  handleAcceptInvite: (gameId: string) => void; // Change the expected signature
  handleDeclineInvite: (gameId: string) => void; // Change the expected signature
}

export const GameInviteItem: React.FC<GameInviteItemProps> = ({ game, handleAcceptInvite, handleDeclineInvite }) => {
  const { title, id } = game; // Assume id is the unique identifier for the game
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowModal(!showModal);
  };

  const AcceptInvite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleAcceptInvite(id); // Pass the game ID directly
  };

  const DeclineInvite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleDeclineInvite(id); // Pass the game ID directly
  };

  return (
    <div className='game-item' onClick={handleToggleModal}>
      <h2>{title}</h2>
      <div>
        <button onClick={AcceptInvite}>Accept</button>
        <button onClick={DeclineInvite}>Decline</button>
      </div>
      {showModal && (
        <GameInfoModal
          game={game}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
