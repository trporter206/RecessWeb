// Import statements and dependencies
import React, { useContext, useState, useEffect } from 'react';
import { Game } from '../../models/Game';
import { UserContext } from '../../services/UserContext';
import { addCommentToGame, 
        addTeamToGame, 
        completeGame, 
        deleteGame, 
        joinGame, 
        leaveGame, 
        removeCommentFromGame, 
        rewardBonusPoints, 
        toggleGamePendingStatus} from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { addGameToUser, removeGameFromPendingInvites, removeGameFromUser, updateGamesJoinedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';
import CircularProgress from '@mui/material/CircularProgress';
import { PlayerItem } from '../User Components/PlayerItem';
import { addGameIdToLocation } from '../../services/locationService';
import { TeamItem } from '../Team Components/TeamItem';
import { TeamChooserModal } from '../Team Components/TeamChooserModal';
import GameCommentBox from './GameCommentBox';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { GameCreationModal } from './GameCreationModal';

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
  const { removeGameFromLocation, 
    removeGame, 
    users, 
    addGameToLocationContext, 
    toggleGamePendingStatusContext,
    addCommentToGameContext,
    removeCommentFromGameContext,
    addPlayerToGameContext,
    removePlayerFromGameContext } = dataContext;
  const [isLoading, setIsLoading] = useState(false);
  const [hostUsername, setHostUsername] = useState('');
  const [showTeamChooser, setShowTeamChooser] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  let isUserPartOfAnyTeam = false;
  const userIsHost = user?.uid === game.hostId;
  const { players, 
    hostId, 
    isTeamGame, 
    comments, 
    id, 
    locationId, 
    date, 
    startTime, 
    endTime,
    maxPlayers,
    skillMaximum,
    skillMinimum,
    description,
    title,
    pending,
    minimumPoints } = game;

  useEffect(() => {
    setIsUserInGame(user ? players.includes(user.uid) : false);
    const fetchHostUsername = async () => {
      const username = await dataContext.getUsernameById(hostId); // Assuming getUsernameById exists in dataContext
      setHostUsername(username || 'Unknown');
    };
    fetchHostUsername();
    if (isTeamGame && profile?.teams) {
      const isOnParticipatingTeam = game.teams.some(teamId => profile.teams.includes(teamId));
      console.log('isOnParticipatingTeam:', isOnParticipatingTeam);
      setCanAcceptTeamInvite(!isOnParticipatingTeam);
      isUserPartOfAnyTeam = profile.teams.length > 0;
    }
  }, [game, dataContext, user, profile]);

  const handleToggleEditModal = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setShowEditGameModal(!showEditGameModal);
  }

  const renderCommentInput = () => {
    return (
      <form onSubmit={handleAddComment} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Submit</button>
      </form>
    );
  };

  const renderComments = () => {
    if (comments.length > 0) {
      return (
        <div>
          <h3>Comments:</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <GameCommentBox 
                  key={comment.id} // Use the comment ID as the key instead of index
                  comment={comment}
                  currentUserId={user?.uid || ''}
                  username={dataContext.getUsernameById(comment.userId) || 'Unknown'} // Ensure this async call is handled correctly
                  onDelete={(comment) => handleDeleteComment(comment.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <p>No comments.</p>;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    // No need for event.stopPropagation(); as it's not an event handler anymore
    if (!user) {
      console.error("User not logged in");
      return;
    }
    try {
      await removeCommentFromGame(id, commentId);
      removeCommentFromGameContext(id, commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };
  

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); 
    setCommentText(event.target.value);
  };

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
        console.error("User not logged in");
        return;
    }

    const commentTimestamp = Timestamp.now();

    const newComment = {
      id: uuidv4(),
      userId: user.uid,
      text: commentText,
      timestamp: commentTimestamp, // Convert to Timestamp
    };

    try {
        // You still call addCommentToGame to actually add the comment to Firestore
        await addCommentToGame(id, newComment);
        // Assuming addCommentToGameContext is a context function to update your local state
        addCommentToGameContext(id, newComment);
        setCommentText('');
    } catch (error) {
        console.error('Error adding comment:', error);
    }
  };


  const handleCompleteGame = async () => {
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
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleJoinLeaveGame = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }

    setIsLoading(true);
    try {
      if (isUserInGame) {
        await leaveGame(id, user.uid);
        await removeGameFromUser(id, user.uid);
        removePlayerFromGameContext(id, user.uid);
        updatePointsForLoggedInUser(-5); // Assume these functions handle Firebase and context updates
        updateGamesJoinedForLoggedInUser(false);
      } else {
        await joinGame(id, user.uid);
        await addGameToUser(id, user.uid);
        addPlayerToGameContext(id, user.uid);
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
    // Clone the date object to avoid mutating the original date
    const gameStartDateTime = new Date(date.getTime());
    // Extract hours and minutes from startTime
    const [hours, minutes] = startTime.split(':').map(Number);
    // Set hours and minutes to the gameStartDateTime
    gameStartDateTime.setHours(hours, minutes, 0, 0); // Reset seconds and milliseconds to 0
    const oneHour = 60 * 60 * 1000; // milliseconds in one hour
    const hasHourPassed = currentTime.getTime() - gameStartDateTime.getTime() >= oneHour;
    return hasHourPassed;
  };
  
  

  const handleInviteResponse = async (accept: boolean) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setIsLoading(true);
    try {
      if (accept) {
        await toggleGamePendingStatus(id);
        toggleGamePendingStatusContext(id);
        addGameToLocationContext(id, locationId);
        await addGameIdToLocation(locationId, id);
      } else {
        await deleteGame(id, removeGame);
      }
      await removeGameFromPendingInvites(user.uid, id);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const renderGameDetails = () => (
    <>
      <h1>{title || 'Game Details'}</h1>
      <p><strong>Location:</strong> {dataContext.locations.find(loc => loc.id === locationId)?.name || 'Unknown Location'}</p>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {`${startTime} - ${endTime}`}</p>
      {isTeamGame ? (
        <>
          <p><strong>Teams:</strong> {teams.length}</p>
        </>
      ) : (
        <>
          <p><strong>Max Players:</strong> {maxPlayers}</p>
          <p><strong>Minimum Points:</strong> {minimumPoints || 'None'}</p>
        </>
      )}
      <p><strong>Skill Level:</strong> {skillMinimum ? `${skillMinimum} - ${skillMaximum}` : 'Not specified'}</p>
      <p><strong>Description:</strong> {description || 'No description provided'}</p>
    </>
  );

  const renderParticipants = () => {
    if (isTeamGame) {
      return game.teams.map(teamId => {
        const team = teams.find(t => t.id === teamId);
        return team && <TeamItem key={team.id} team={team} />;
      });
    } else {
      return players.map(playerId => {
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
      await addTeamToGame(id, chosenTeamId);
      addTeamToGameContext(chosenTeamId, id);
    } catch (error) {
      console.error('Error adding team to game:', error);
    }
    setShowTeamChooser(false);
  };

  return (
    <div className="modal-backdrop">
    {isLoading ? <CircularProgress /> : (
      <div className="gameInfoModal-content">
        {pending && <h2>Invitation from {hostUsername}</h2>}
        {renderGameDetails()}
        {!pending && (
          <>
            <h3>{isTeamGame ? 'Teams' : 'Players'}:</h3>
            <div className="game-participantlist-container">
              {renderParticipants()}
            </div>
            {/* Conditionally render buttons based on game type and user's team status */}
            {user && user.uid !== hostId && isTeamGame && isUserPartOfAnyTeam && !canAcceptTeamInvite && (
              <button onClick={handleJoinLeaveGame}>
                {isUserInGame ? 'Leave Game' : 'Join Game'}
              </button>
            )}
            {/* Show "Accept Invite" button if the user can accept the team invite */}
            {user && user.uid !== hostId && canAcceptTeamInvite && (
              <button onClick={handleAcceptTeamInvite}>
                Accept Invite
              </button>
            )}
            {/* Do not show "Join Game" button if it's a team game and user is not part of any team */}
            {!isTeamGame && user && user.uid !== hostId && (
              <button onClick={handleJoinLeaveGame}>
                {isUserInGame ? 'Leave Game' : 'Join Game'}
              </button>
            )}
            <button onClick={() => onClose()}>Close</button>
          </>
        )}
        {pending && (
          <>
            <button onClick={() => handleInviteResponse(true)}>Accept</button>
            <button onClick={() => handleInviteResponse(false)}>Decline</button>
          </>
        )}
        {hasOneHourPassed() && user && user.uid === hostId && (
          <button onClick={handleCompleteGame}>Complete Game</button>
        )}
        {userIsHost && (
          <button onClick={handleToggleEditModal}>Edit</button>
        )}
        {isUserInGame && (
          <>
            {renderComments()}
            {renderCommentInput()}
          </>
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
    {showEditGameModal && (
      <GameCreationModal
        show={showEditGameModal}
        onClose={() => handleToggleEditModal()}
        editedGame={game}
        editMode={true}
      />
    )}
  </div>
  );
};
