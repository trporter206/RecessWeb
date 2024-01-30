// LocationItem component
import React, { useState } from 'react';
import { User } from '../../models/User';
import { UserInfoModal } from './UserInfoModal';

export const PlayerItem: React.FC<{ user: User }> = ({ user }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className='player-item' onClick={handleToggleInfo}>
      <div className='player-content'>
        <h3>{user.username}</h3>
        <h3>Points: {user.points}</h3>
      </div>
      {showInfo && (
        <UserInfoModal 
          user={user} 
        />
      )}
    </div>
  );
};
