// GameInfoModal component
import React, { useContext, useState, useEffect } from 'react';
import { Game } from '../../models/Game';
import { UserContext } from '../../services/UserContext';
import { completeGame, joinGame, leaveGame, rewardBonusPoints } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { updateGamesJoinedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';

interface GameInfoModalProps {
  game: Game;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, onClose }) => {
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [isUserInGame, setIsUserInGame] = useState(false);
  const { updateGamePlayers, removeGameFromLocation, removeGame } = useContext(DataContext);
  const { id, locationId, hostId, players, minimumPoints, description } = game;

  useEffect(() => {
    setIsUserInGame(user ? players.includes(user.uid) : false);
  }, [user, players]);

  const hasOneHourPassed = () => {
    const currentTime = new Date();
    const gameStartTime = new Date(game.time); // Assuming game.startTime is a Date object
    const oneHour = 60 * 60 * 1000; // milliseconds in one hour
    return currentTime.getTime() - gameStartTime.getTime() >= oneHour;
  };

  const canJoinGame = profile && profile.points >= minimumPoints;

  const handleCompleteGame = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }
    try {
      await rewardBonusPoints(id);
      await completeGame(id);
      removeGameFromLocation(id, locationId);
      removeGame(id);
      onClose();
    } catch (error) {
      console.error('Error completing game:', error);
    }
  }


  const handleJoinLeaveGame = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      if (isUserInGame) {
        await leaveGame(id, user.uid, updateGamePlayers);
        await updatePointsForLoggedInUser(-5);
        await updateGamesJoinedForLoggedInUser(false);
      } else {
        await joinGame(id, user.uid, updateGamePlayers);
        await updatePointsForLoggedInUser(5);
        await updateGamesJoinedForLoggedInUser(true);
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
        {hasOneHourPassed() && user && user.uid === hostId && (
          <button onClick={handleCompleteGame}>
            Complete Game
          </button>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
