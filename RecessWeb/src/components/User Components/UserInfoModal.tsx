import React, { useContext, useState } from 'react';
import { User } from '../../models/User';
import { UserContext } from '../../services/UserContext'; // Assuming this exists for managing the context of the currently logged-in user
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { DataContext } from '../../services/DataProvider';
import Button from '@mui/material/Button'; // Assuming you're using Material-UI for UI components
import { GameCreationModal } from '../Game Components/GameCreationModal';

interface UserInfoModalProps {
  user: User;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({ user }) => {
  const { username, points, gamesHosted, gamesJoined, id } = user;
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const profile = userContext ? userContext.profile : null;
  const isInNetwork = profile?.network?.includes(id);
  const currentUserRating = user.ratings?.[profile?.id ?? ""] ?? null;
  const isNotCurrentUser = profile && profile.id !== id;
  const [showGameCreation, setShowGameCreation] = useState(false);


  const averageRating = dataContext.getAverageRating(id);

  const handleRating = async (ratingValue: 1 | 0, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (profile && profile.id) {
      try {
        dataContext.updateUserRatings(id, profile.id, ratingValue);
      } catch (error) {
        console.error("Failed to update rating:", error);
      }
    } else {
      console.error("No logged-in user found.");
    }
  };

  const handleInvitePlayer = (e: React.FormEvent) => {
    e.stopPropagation();
    setShowGameCreation(true);
  }

  const handleCloseGameCreation = () => {
    setShowGameCreation(false);
  };

  return (
    <div className="InfoModal-backdrop">
      <div className="userInfoModal-content">
        <h3>{username}</h3>
        {isInNetwork && (
          <div>
            <button
              onClick={(e) => handleRating(1, e)}
              style={{ color: currentUserRating === 1 ? 'green' : undefined }}>
              <ThumbUpIcon />
            </button>
            <button
              onClick={(e) => handleRating(0, e)}
              style={{ color: currentUserRating === 0 ? 'red' : undefined }}>
              <ThumbDownIcon />
            </button>
          </div>
        )}
        <h3>Points: {points}</h3>
        <h3>Rating: {averageRating.toFixed(2)}</h3>
        <h4>Games Hosted: {gamesHosted}</h4>
        <h4>Games Joined: {gamesJoined}</h4>
        {isNotCurrentUser && (
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleInvitePlayer}>
            Invite to Game
          </Button>
        )}
        {showGameCreation && (
          <GameCreationModal
            show={showGameCreation}
            onClose={handleCloseGameCreation}
            invitee={user}
          />
        )}
      </div>
    </div>
  );
};
