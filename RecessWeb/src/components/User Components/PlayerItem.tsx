import React, { useState } from 'react';
import { User } from '../../models/User';
import { UserInfoModal } from './UserInfoModal';

export const PlayerItem: React.FC<{ user: User }> = ({ user }) => {
  const [showInfo, setShowInfo] = useState(false);
  const { username, points, rating } = user;

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className='player-item' onClick={handleToggleInfo}>
      <div className='player-content'>
        <div className='player-circle'></div>
        <h2>{username}</h2>
        <div className='playerItem-stats'>
          <div className='player-points'>
            <p>Points</p>
            <h3>{points}</h3>
          </div>
          <div className='player-rating'>
            <p>Rating</p>
            <h3>{rating}</h3>
          </div>
        </div>
      </div>
      {showInfo && (
        <UserInfoModal 
          user={user} 
        />
      )}
    </div>
  );
};
