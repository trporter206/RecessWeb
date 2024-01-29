// GameInfoModal component
import React, { useContext, useState, useEffect } from 'react';
import { Game } from '../../models/Game';
import { UserContext } from '../../services/UserContext';
import { joinGame, leaveGame } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';

interface GameInfoModalProps {
  game: Game;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, onClose }) => {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [isUserInGame, setIsUserInGame] = useState(false);
  const { updateGamePlayers } = useContext(DataContext);
  const { id, locationId, hostId, players, minimumPoints, description } = game;

  useEffect(() => {
    setIsUserInGame(user ? players.includes(user.uid) : false);
  }, [user, players]);

  const canJoinGame = profile && profile.points >= minimumPoints;

  const handleJoinLeaveGame = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      if (isUserInGame) {
        await leaveGame(id, user.uid, updateGamePlayers);
      } else {
        await joinGame(id, user.uid, updateGamePlayers);
      }
      setIsUserInGame(!isUserInGame);
    } catch (error) {
      console.error('Error handling game join/leave:', error);
    }
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="gameInfoModal-content">
        <h3>{locationId}</h3>
        <p>Minimum Points: {minimumPoints}</p>
        <p>Players: {players.length}</p>
        <p>{description}</p>
        {user && user.uid !== hostId && canJoinGame && (
          <button onClick={handleJoinLeaveGame}>
            {isUserInGame ? 'Leave Game' : 'Join Game'}
          </button>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
