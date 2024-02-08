// Import statements and dependencies
import React, { useContext, useState, useEffect } from 'react';
import { Game } from '../../models/Game';
import { UserContext } from '../../services/UserContext';
import { addTeamToGame, completeGame, deleteGame, joinGame, leaveGame, rewardBonusPoints, toggleGamePendingStatus } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { removeGameFromPendingInvites, updateGamesJoinedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';
import CircularProgress from '@mui/material/CircularProgress';
import { PlayerItem } from '../User Components/PlayerItem';
// import { User } from '../../models/User';
import { addGameIdToLocation } from '../../services/locationService';
import { TeamItem } from '../Team Components/TeamItem';
import { TeamChooserModal } from '../Team Components/TeamChooserModal';

interface GameInfoModalProps {
  game: Game;
  onClose: () => void;
}

export const GameInfoModal: React.FC<GameInfoModalProps> = ({ game, onClose }) => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const profile = userContext?.profile;
  const [canAcceptTeamInvite, setCanAcceptTeamInvite] = useState(false);
  const user = userContext ? userContext.user : null;
  const { teams, addTeamToGameContext } = dataContext;
  const [isUserInGame, setIsUserInGame] = useState(false);
  const { updateGamePlayers, removeGameFromLocation, removeGame, users, addGameToLocationContext, toggleGamePendingStatusContext } = dataContext;
  const [isLoading, setIsLoading] = useState(false);
  const [hostUsername, setHostUsername] = useState('');
  const [showTeamChooser, setShowTeamChooser] = useState(false);
  let isUserPartOfAnyTeam = false;

  useEffect(() => {
    setIsUserInGame(user ? game.players.includes(user.uid) : false);
    const fetchHostUsername = async () => {
      const username = await dataContext.getUsernameById(game.hostId); // Assuming getUsernameById exists in dataContext
      setHostUsername(username || 'Unknown');
    };
    fetchHostUsername();
    if (game.isTeamGame && profile?.teams) {
      const isOnParticipatingTeam = game.teams.some(teamId => profile.teams.includes(teamId));
      console.log('isOnParticipatingTeam:', isOnParticipatingTeam);
      setCanAcceptTeamInvite(!isOnParticipatingTeam);
      isUserPartOfAnyTeam = profile.teams.length > 0;
    }
  }, [game, dataContext, user, profile]);

  const handleCompleteGame = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setIsLoading(true);
    try {
      await rewardBonusPoints(game.id);
      await completeGame(game.id);
      removeGameFromLocation(game.id, game.locationId);
      removeGame(game.id);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleJoinLeaveGame = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setIsLoading(true);
    try {
      if (isUserInGame) {
        await leaveGame(game.id, user.uid, updateGamePlayers);
        updatePointsForLoggedInUser(-5); // Assume these functions handle Firebase and context updates
        updateGamesJoinedForLoggedInUser(false);
      } else {
        await joinGame(game.id, user.uid, updateGamePlayers);
        updatePointsForLoggedInUser(5);
        updateGamesJoinedForLoggedInUser(true);
      }
      setIsUserInGame(!isUserInGame);
    } finally {
      setIsLoading(false);
    }
  };

  const hasOneHourPassed = () => {
    const currentTime = new Date();
    // Combine date and startTime into a single Date object
    const gameStartDateTime = new Date(`${game.date}T${game.startTime}`);
    const oneHour = 60 * 60 * 1000; // milliseconds in one hour
    return currentTime.getTime() - gameStartDateTime.getTime() >= oneHour;
  };
  

  const handleInviteResponse = async (accept: boolean) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setIsLoading(true);
    try {
      if (accept) {
        await toggleGamePendingStatus(game.id);
        toggleGamePendingStatusContext(game.id);
        addGameToLocationContext(game.id, game.locationId);
        await addGameIdToLocation(game.locationId, game.id);
      } else {
        await deleteGame(game.id, removeGame);
      }
      await removeGameFromPendingInvites(user.uid, game.id);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const renderGameDetails = () => (
    <>
      <h1>{game.title || 'Game Details'}</h1>
      <p><strong>Location:</strong> {dataContext.locations.find(loc => loc.id === game.locationId)?.name || 'Unknown Location'}</p>
      <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {`${game.startTime} - ${game.endTime}`}</p>
      {game.isTeamGame ? (
        <>
          <p><strong>Teams:</strong> {game.teams.length}</p>
        </>
      ) : (
        <>
          <p><strong>Max Players:</strong> {game.maxPlayers}</p>
          <p><strong>Minimum Points:</strong> {game.minimumPoints || 'None'}</p>
        </>
      )}
      <p><strong>Skill Level:</strong> {game.skillMinimum ? `${game.skillMinimum} - ${game.skillMaximum}` : 'Not specified'}</p>
      <p><strong>Description:</strong> {game.description || 'No description provided'}</p>
    </>
  );

  const renderParticipants = () => {
    if (game.isTeamGame) {
      return game.teams.map(teamId => {
        const team = teams.find(t => t.id === teamId);
        return team && <TeamItem key={team.id} team={team} />;
      });
    } else {
      return game.players.map(playerId => {
        const player = users.find(user => user.id === playerId);
        return player && <PlayerItem key={player.id} user={player} />;
      });
    }
  };

  const handleAcceptTeamInvite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setShowTeamChooser(true);
  }

  const handleTeamChosen = async (chosenTeamId: string) => {
    try {
      await addTeamToGame(game.id, chosenTeamId);
      addTeamToGameContext(chosenTeamId, game.id);
    } catch (error) {
      console.error('Error adding team to game:', error);
    }
    setShowTeamChooser(false);
  };

  return (
    <div className="modal-backdrop">
    {isLoading ? <CircularProgress /> : (
      <div className="gameInfoModal-content">
        {game.pending && <h2>Invitation from {hostUsername}</h2>}
        {renderGameDetails()}
        {!game.pending && (
          <>
            <h3>{game.isTeamGame ? 'Teams' : 'Players'}:</h3>
            <div className="game-participantlist-container">
              {renderParticipants()}
            </div>
            {/* Conditionally render buttons based on game type and user's team status */}
            {user && user.uid !== game.hostId && game.isTeamGame && isUserPartOfAnyTeam && !canAcceptTeamInvite && (
              <button onClick={handleJoinLeaveGame}>
                {isUserInGame ? 'Leave Game' : 'Join Game'}
              </button>
            )}
            {/* Show "Accept Invite" button if the user can accept the team invite */}
            {user && user.uid !== game.hostId && canAcceptTeamInvite && (
              <button onClick={handleAcceptTeamInvite}>
                Accept Invite
              </button>
            )}
            {/* Do not show "Join Game" button if it's a team game and user is not part of any team */}
            {!game.isTeamGame && user && user.uid !== game.hostId && (
              <button onClick={handleJoinLeaveGame}>
                {isUserInGame ? 'Leave Game' : 'Join Game'}
              </button>
            )}
            <button onClick={() => onClose()}>Close</button>
          </>
        )}
        {game.pending && (
          <>
            <button onClick={() => handleInviteResponse(true)}>Accept</button>
            <button onClick={() => handleInviteResponse(false)}>Decline</button>
          </>
        )}
        {hasOneHourPassed() && user && user.uid === game.hostId && (
          <button onClick={handleCompleteGame}>Complete Game</button>
        )}
      </div>
    )}
    {showTeamChooser && (
      <TeamChooserModal
        show={showTeamChooser}
        onClose={() => setShowTeamChooser(false)}
        onTeamChosen={handleTeamChosen}
      />
    )}
  </div>
  );
};
