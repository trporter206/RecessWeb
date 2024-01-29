import React from 'react';
import { User } from '../../models/User';
// import { useNavigate } from 'react-router-dom';
// import { DataContext } from '../../services/DataProvider';
// import { UserContext } from '../../services/UserContext';

interface UserInfoModalProps {
  user: User;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({ user }) => {
  const { username } = user;

  return (
    <div className="InfoModal-backdrop">
      <div className="userInfoModal-content">
        <h3>{username}</h3>
      </div>
    </div>
  );
};
