import React from 'react';
import { User } from '../../models/User';
// import { useNavigate } from 'react-router-dom';
// import { DataContext } from '../../services/DataProvider';
// import { UserContext } from '../../services/UserContext';

interface UserInfoModalProps {
  user: User;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({ user }) => {
  const { username, points, gamesHosted, gamesJoined, rating } = user;

  return (
    <div className="InfoModal-backdrop">
      <div className="userInfoModal-content">
        <h3>{username}</h3>
        <h3>Points: {points}</h3>
        <h3>Rating: {rating}</h3>
        <h4>Games Played: {gamesHosted}</h4>
        <h4>Games Joined: {gamesJoined}</h4>
      </div>
    </div>
  );
};
