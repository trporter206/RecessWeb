import React, { useContext } from 'react';
import { User } from '../../models/User';
import { UserContext } from '../../services/UserContext'; // Assuming this exists
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // Material-UI Icons
import ThumbDownIcon from '@mui/icons-material/ThumbDown'; // Material-UI Icons

interface UserInfoModalProps {
  user: User;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({ user }) => {
  const { username, points, gamesHosted, gamesJoined, rating, id } = user;
  const userContext = useContext(UserContext);
  const profile = userContext ? userContext.profile : null;
  // Check if the user is in the logged-in user's network
  console.log(user);
  const isInNetwork = profile?.network?.includes(id);
  return (
    <div className="InfoModal-backdrop">
      <div className="userInfoModal-content">
        <h3>{username}</h3>
        {isInNetwork && (
          <div>
            <button>
              <ThumbUpIcon />
            </button>
            <button>
              <ThumbDownIcon /> 
            </button>
          </div>
        )}
        <h3>Points: {points}</h3>
        <h3>Rating: {rating}</h3>
        <h4>Games Played: {gamesHosted}</h4>
        <h4>Games Joined: {gamesJoined}</h4>
      </div>
    </div>
  );
};
