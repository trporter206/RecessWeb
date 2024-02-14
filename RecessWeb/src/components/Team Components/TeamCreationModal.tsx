import React, { useState, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataContext } from '../../services/DataProvider';
import { createTeam, updateTeam } from '../../services/TeamServices';
import { UserContext } from '../../services/UserContext';
import { addTeamToUser } from '../../services/UserServices';
import { Team } from '../../models/Team';

interface TeamCreationModalProps {
  show: boolean;
  onClose: () => void;
  editMode?: boolean;
  editedTeam?: Team;
}

export const TeamCreationModal: React.FC<TeamCreationModalProps> = ({ show, onClose, editMode, editedTeam }) => {
  const { addTeam, addTeamToPlayerContext, updateTeamContext } = useContext(DataContext);
  const userContext = useContext(UserContext);
  const profile = userContext ? userContext.profile : null;
  const [name, setName] = useState<string>(editedTeam ? editedTeam.name : '')
  const [skill, setSkill] = useState<number>(editedTeam ? editedTeam.skill : 1);
  const [lookingForPlayers, setLookingForPlayers] = useState<boolean>(editedTeam ? editedTeam.lookingForPlayers : false);
  const [joinInstructions, setJoinInstructions] = useState<string>(editedTeam ? editedTeam.joinInstructions : '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEditMode = Boolean(editMode);

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleSave = async () => {
    if (!name || skill < 1 || !joinInstructions) {
      console.error('Invalid team data');
      return;
    }

    if (isEditMode && editedTeam) {
      const updatedTeam = {
        ...editedTeam,
        name,
        skill,
        lookingForPlayers,
        joinInstructions
      };

      setIsLoading(true);
      try {
        await updateTeam(editedTeam.id, updatedTeam);
        updateTeamContext(editedTeam.id, updatedTeam);
      } catch (error) {
        console.error('Error updating team:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }

    } else {
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
        //add to firebase
        const newTeamId = await createTeam(newTeam);
        addTeamToUser(profile?.id || '', newTeamId);
        //add to context
        addTeam({ ...newTeam, id: newTeamId });
        addTeamToPlayerContext(newTeamId, profile?.id || '');
        console.log('Team created successfully');
      } catch (error) {
        console.error('Error creating team:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }
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
            <h2>{isEditMode ? "Edit Team" : "Create Team"}</h2>
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
            <button onClick={handleSave}>{isEditMode ? 'Save Changes' : 'Create Team'}</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};
