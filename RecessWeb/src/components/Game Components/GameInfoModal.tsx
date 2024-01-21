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
  const [isUserInGame, setIsUserInGame] = useState(false);
  const { updateGamePlayers } = useContext(DataContext);

  useEffect(() => {
    setIsUserInGame(user ? game.players.includes(user.uid) : false);
  }, [user, game.players]);

  const handleJoinLeaveGame = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      if (isUserInGame) {
        await leaveGame(game.id, user.uid, updateGamePlayers);
      } else {
        await joinGame(game.id, user.uid, updateGamePlayers);
      }
      setIsUserInGame(!isUserInGame);
    } catch (error) {
      console.error('Error handling game join/leave:', error);
    }
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="gameInfoModal-content">
        <h3>{game.locationId}</h3>
        <p>Players: {game.players.length}</p>
        {user && user.uid !== game.hostId && (
          <button onClick={handleJoinLeaveGame}>
            {isUserInGame ? 'Leave Game' : 'Join Game'}
          </button>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
