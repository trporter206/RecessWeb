import React, { useContext, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Team } from '../../models/Team';
import { UserContext } from '../../services/UserContext';
import { DataContext } from '../../services/DataProvider';
import { removeMemberFromTeam } from '../../services/TeamServices';
import { PlayerItem } from '../User Components/PlayerItem';
import { User } from '../../models/User';

interface TeamInfoModalProps {
  team: Team;
  onClose: () => void;
}

export const TeamInfoModal: React.FC<TeamInfoModalProps> = ({ team, onClose }) => {
  const userContext = useContext(UserContext);
  const { users, removeMemberFromTeamContext } = useContext(DataContext);
  const user = userContext?.user;
  const [isLoading, setIsLoading] = useState(false);
  const isUserInTeam = user ? team.members.includes(user.uid) : false;

  const handleLeaveTeam = async (event: React.MouseEvent) =>  {
    event.stopPropagation();
    if (!user) {
      console.error("User not logged in");
      return;
    }
    setIsLoading(true);
    try {
        await removeMemberFromTeam(team.id, user.uid);
        removeMemberFromTeamContext(team.id, user.uid);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
        onClose();
    }
  };

  const renderTeamDetails = () => (
    <>
      <h1>{team.name}</h1>
      <p><strong>Skill Level:</strong> {team.skill}</p>
      <p><strong>Wins:</strong> {team.wins}</p>
      <p><strong>Losses:</strong> {team.losses}</p>
      <p><strong>Looking for Players:</strong> {team.lookingForPlayers ? 'Yes' : 'No'}</p>
      <p><strong>Join Instructions:</strong> {team.joinInstructions}</p>
    </>
  );

  return (
    <div className="modal-backdrop">
      {isLoading ? <CircularProgress /> : (
        <div className="gameInfoModal-content">
          {renderTeamDetails()}
          <div className="team-memberlist-container">
            <h3>Members:</h3>
            {team.members.map(memberId => (
              <PlayerItem key={memberId} user={users.find(user => user.id === memberId) || {} as User} />
            ))}
          </div>
          {user && isUserInTeam && (
            <button onClick={handleLeaveTeam}>Leave Team</button>
          )}
          <button onClick={() => onClose()}>Close</button>
        </div>
      )}
    </div>
  );
};
