import React, { useState, useContext } from 'react';
import { DataContext } from '../../services/DataProvider';
import { GameCreationModal } from '../Game Components/GameCreationModal';
import { UserContext } from '../../services/UserContext';
import { Game } from '../../models/Game';
import { User } from '../../models/User';
import { addGameToPendingInvites } from '../../services/UserServices';
import { CircularProgress } from '@mui/material';

interface InviteOptionsModalProps {
  show: boolean;
  onClose: (event?: React.MouseEvent) => void;
  invitee: User;
}

const InvitePlayerModal: React.FC<InviteOptionsModalProps> = ({ show, onClose, invitee }) => {
  const { games } = useContext(DataContext);
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const [showGameCreation, setShowGameCreation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addGameInviteToPlayerContext } = useContext(DataContext);

  if (!show || !user) {
    return null;
  }

  const userGames = games.filter(game => 
    game.hostId === user.uid || game.players.includes(user.uid)
  );

  const handleInviteToExistingGame = async (e: React.FormEvent, gameId: string) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      await addGameToPendingInvites(invitee.id, gameId);
      addGameInviteToPlayerContext(gameId, invitee.id);
      alert(`Invitation sent to ${invitee.username} for game ${gameId}.`); // Example feedback
    } catch (error) {
      console.error("Failed to invite player to game:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleOpenGameCreation = () => setShowGameCreation(true);
  const handleCloseGameCreation = () => setShowGameCreation(false);

  const isUserInvitedOrInGame = (gameId: string) => {
    const alreadyInvited = invitee.pendingInvites.find(game => game === gameId);
    const alreadyInGame = userGames.find(game => game.players.includes(invitee.id));
    if (alreadyInGame || alreadyInvited) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="gameCreationModal-content">
        {isLoading ? <CircularProgress /> : (
          <>
            <h2>Invite {invitee.username} to Game</h2>
            <button onClick={handleOpenGameCreation}>Create New Game</button>
            {userGames.length > 0 ? (
              <ul>
                {userGames.map((game: Game) => (
                  <li key={game.id}>
                    {game.title} - <button 
                      onClick={(e) => handleInviteToExistingGame(e, game.id)}
                      disabled={isUserInvitedOrInGame(game.id)}
                    >
                      Invite to This Game
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No games available to invite the player to.</p>
            )}
            <button onClick={onClose}>Close</button>
          </>
        )}
        {showGameCreation && (
          <GameCreationModal
            show={showGameCreation}
            onClose={handleCloseGameCreation}
            invitee={invitee}
          />
        )}
      </div>
    </div>
  );
};

export default InvitePlayerModal;
