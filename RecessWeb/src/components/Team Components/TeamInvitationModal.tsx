import React, { useContext, useState } from 'react';
import { DataContext } from '../../services/DataProvider';
import { UserContext } from '../../services/UserContext';
import { User } from '../../models/User';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography'; // Import Typography for the text

interface TeamInvitationModalProps {
  show: boolean;
  onClose: () => void;
  invitee: User;
}

export const TeamInvitationModal: React.FC<TeamInvitationModalProps> = ({ show, onClose, invitee }) => {
  const { teams } = useContext(DataContext);
  const userContext = useContext(UserContext);
  const profile = userContext?.profile;
  const [selectedTeam, setSelectedTeam] = useState('');

  // Filter teams to those with fewer than 6 players and the user is a member
  const eligibleTeams = teams.filter(team => team.members.length < 6 && team.members.includes(profile?.id ?? ''));

  if (!show) {
    return null;
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the event from propagating to parent elements
    onClose(); // Closes the modal
  };

  const handleTeamSelect = (event: SelectChangeEvent<string>) => {
    setSelectedTeam(event.target.value);
  };

  const handleInvite = () => {
    console.log('Inviting', invitee.username, 'to team', selectedTeam);
    // Placeholder for invite logic
    onClose(); // Close the modal after inviting
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="invitationModal-content" onClick={e => e.stopPropagation()}>
        <h2>Invite {invitee.username} to a Team</h2>
        {eligibleTeams.length > 0 ? (
          <>
            <FormControl fullWidth>
              <InputLabel id="team-select-label">Select a Team</InputLabel>
              <Select
                labelId="team-select-label"
                id="team-select"
                value={selectedTeam}
                label="Select a Team"
                onChange={handleTeamSelect}
              >
                {eligibleTeams.map(team => (
                  <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleInvite} style={{ marginTop: '20px' }}>
              Invite to Team
            </Button>
          </>
        ) : (
          <Typography>No teams to invite to.</Typography> 
        )}
      </div>
    </div>
  );
};
