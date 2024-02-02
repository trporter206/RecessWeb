// GameInfoModal component
import React, { useContext, useState, useEffect } from 'react';
import { Game } from '../../models/Game';
import { UserContext } from '../../services/UserContext';
import { completeGame, joinGame, leaveGame, rewardBonusPoints } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { updateGamesJoinedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';
import CircularProgress from '@mui/material/CircularProgress';
import { PlayerItem } from '../User Components/PlayerItem';
import { User } from '../../models/User';

interface GameInfoModalProps {
  game: Game;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, onClose }) => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [isUserInGame, setIsUserInGame] = useState(false);
  const { updateGamePlayers, removeGameFromLocation, removeGame, users } = dataContext;
  const { id, locationId, hostId, players, minimumPoints, description } = game;
  const [isLoading, setIsLoading] = useState(false);

  const locationName = dataContext.locations.find(loc => loc.id === locationId)?.name || 'Unknown Location';

  const gamePlayerDetails = players
      .map(playerId => users.find(user => user.id === playerId))
      .filter((user): user is User => user !== undefined);

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
    setIsLoading(true);
    try {
      await rewardBonusPoints(id);
      await completeGame(id);
      removeGameFromLocation(id, locationId);
      removeGame(id);
    } catch (error) {
      console.error('Error completing game:', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
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
      {isLoading ? (
        <div className="gameInfoModal-content">
          <CircularProgress /> // Show loading indicator
        </div>
      ) : (
        <div className="gameInfoModal-content">
            <h1>{locationName}</h1>
            <p>Minimum Points: {minimumPoints}</p>
            <p>{description}</p>
            <h3>Players: {players.length}</h3>
            <div className="game-playerlist-container">
              {gamePlayerDetails.map(player => (
                <div key={player.id}>
                  <PlayerItem user={player} />
                </div>
              ))}
            </div>
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
      )}
    </div>
  );
};
