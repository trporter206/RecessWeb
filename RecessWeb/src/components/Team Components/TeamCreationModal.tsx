import React, { useState, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataContext } from '../../services/DataProvider';
import { createTeam } from '../../services/TeamServices';
import { UserContext } from '../../services/UserContext';

interface TeamCreationModalProps {
  show: boolean;
  onClose: () => void;
}

export const TeamCreationModal: React.FC<TeamCreationModalProps> = ({ show, onClose }) => {
  const { addTeam } = useContext(DataContext);
  const userContext = useContext(UserContext);
  const profile = userContext ? userContext.profile : null;
  const [name, setName] = useState<string>('');
  const [skill, setSkill] = useState<number>(1);
  const [lookingForPlayers, setLookingForPlayers] = useState<boolean>(false);
  const [joinInstructions, setJoinInstructions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleSave = async () => {
    if (!name || skill < 1 || !joinInstructions) {
      console.error('Invalid team data');
      return;
    }

    const newTeam = {
      name,
      creator: profile?.id || '',
      skill,
      wins: 0, // Default value
      losses: 0, // Default value
      members: [profile?.id || ''], // Default empty array
      sport: '', // Default empty string
      availableLocations: [], // Default empty array
      availableTimes: [], // Default empty array
      lookingForPlayers,
      joinInstructions,
      pendingChallenges: [] // Default empty array
    };

    setIsLoading(true);
    try {
      const newTeamId = await createTeam(newTeam);
      addTeam({ ...newTeam, id: newTeamId });
      console.log('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='teamModal-content' onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <h2>Create Team</h2>
            <div className="form-group">
              <label>Team Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Skill Level:</label>
              <input type="number" value={skill} onChange={(e) => setSkill(Number(e.target.value))} min="1" max="5" required />
            </div>
            <div className="form-group">
              <label>Looking For Players:</label>
              <input type="checkbox" checked={lookingForPlayers} onChange={(e) => setLookingForPlayers(e.target.checked)} />
            </div>
            <div className="form-group">
              <label>Join Instructions:</label>
              <textarea value={joinInstructions} onChange={(e) => setJoinInstructions(e.target.value)} required />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};
