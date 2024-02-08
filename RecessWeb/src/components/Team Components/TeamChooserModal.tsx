import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { DataContext } from '../../services/DataProvider';
import { UserContext } from '../../services/UserContext';

interface TeamChooserModalProps {
  show: boolean;
  onClose: () => void;
  onTeamChosen: (teamId: string) => void;
}

export const TeamChooserModal: React.FC<TeamChooserModalProps> = ({ show, onClose, onTeamChosen }) => {
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

  const handleChooseTeam = () => {
    onTeamChosen(selectedTeam);
    onClose(); // Assuming you want to close the modal after the team is chosen
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="invitationModal-content" onClick={e => e.stopPropagation()}>
        <h2>Choose a Team</h2>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleChooseTeam}
              style={{ marginTop: '20px' }}
              disabled={!selectedTeam} // Disable the button if no team is selected
            >
              Choose Team
            </Button>
          </>
        ) : (
          <Typography>No teams to invite to.</Typography> 
        )}
      </div>
    </div>
  );
};
