import React, { useState, useContext, useEffect } from 'react';
import { createGame, updateGame } from '../../services/GameServices';
import { DataContext, sportsList } from '../../services/DataProvider';
import { Location } from '../../models/Location';
import { UserContext } from '../../services/UserContext';
import { addGameToPendingInvites, updateGamesHostedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';
import { addGameIdToLocation, updateTotalGamesForLocation } from '../../services/locationService';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../models/User';
import { Game } from '../../models/Game';

interface GameCreationModalProps {
  show: boolean;
  onClose: (event?: React.MouseEvent) => void;
  locationId?: string; // Optional prop for default location ID
  invitee?: User;
  editMode?: boolean;
  editedGame?: Game;
}

const intensityLevels = [
  "Casual",
  "Sweaty",
  "Competitive"
];

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, locationId, invitee, editMode, editedGame }) => {
  const { locations, addGameToLocationContext, addGame, teams, updateGameContext, addGameInviteToPlayerContext } = useContext(DataContext);
  const [selectedLocation, setSelectedLocation] = useState<string>(editedGame?.locationId || '');
  const [date, setDate] = useState<string>(editedGame ? editedGame.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>(editedGame ? editedGame.startTime : '12:00');
  const [endTime, setEndTime] = useState<string>(editedGame ? editedGame.endTime : '13:00');
  const [selectedSport, setSelectedSport] = useState<string>(editedGame ? editedGame.sport : sportsList[0]);
  // const [maxTeams, setMaxTeams] = useState<number>(editedGame && editedGame.isTeamGame ? 2 : 0); // For team games
  const [maxPlayers, setMaxPlayers] = useState<number>(editedGame && !editedGame.isTeamGame ? editedGame.maxPlayers : 0); // For non-team games
  // const [skillMinimum, setSkillMinimum] = useState<number>(editedGame ? editedGame.skillMinimum : 1);
  // const [skillMaximum, setSkillMaximum] = useState<number>(editedGame ? editedGame.skillMaximum : 5);
  const [title, setTitle] = useState<string>(editedGame ? editedGame.title : '');
  const [description, setDescription] = useState<string>(editedGame ? editedGame.description : '');
  // const [minimumPoints, setMinimumPoints] = useState<number>(editedGame ? editedGame.minimumPoints : 0);
  const [inviteOnly, setInviteOnly] = useState<boolean>(false);
  const [intensity, setIntensity] = useState<string>(editedGame ? editedGame.intensity : "Casual");
  // const [isTeamGame, setIsTeamGame] = useState<boolean>(false); // New state for "Teams Only"
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const isUserOnTeam = profile?.teams && profile.teams.length > 0;
  // const [selectedTeam, setSelectedTeam] = useState<string>('');
  // const userTeams = profile?.teams?.map(teamId => teams.find(team => team.id === teamId)).filter(team => team) ?? [];
  const isEditMode = Boolean(editedGame);

  useEffect(() => {
    const defaultLocationId = locationId || (locations.length > 0 ? locations[0].id : '');
    setSelectedLocation(defaultLocationId);
  }, [locations, locationId, teams, profile?.teams]);
  
  const handleClose = () => {
    onClose();
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleSave = async () => {
    if (!selectedLocation || !date || !startTime || !endTime || !user) {
      console.error('Invalid game data');
      return;
    }

    if (editMode && editedGame) {
      const gamePayload = {
        id: editedGame.id,
        locationId: selectedLocation,
        players: editedGame.players,
        teams: editedGame.teams, 
        date: new Date(date),
        startTime: startTime,
        endTime: endTime,
        skillMinimum: 0,
        skillMaximum: 0,
        maxPlayers: maxPlayers, 
        title: title,
        hostId: editedGame.hostId,
        minimumPoints: 0, 
        description: description,
        pending: editedGame.pending,
        isTeamGame: false,
        comments: editedGame.comments,
        inviteOnly: inviteOnly,
        sport: selectedSport,
        intensity: intensity
      };

      setIsLoading(true);
      try {
        await updateGame(editedGame.id, gamePayload);
        updateGameContext(editedGame.id, gamePayload);
        console.log('Game Edited successfully');
      } catch (error) {
        console.error('Error editing game:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }
    } else {
      const gamePayload = {
        locationId: selectedLocation,
        players: invitee ? [invitee.id] : [],
        teams: [], 
        date: new Date(date),
        startTime,
        endTime,
        skillMinimum: 0,
        skillMaximum: 0,
        maxPlayers: maxPlayers,
        title,
        hostId: user.uid,
        minimumPoints: 0, 
        description,
        pending: !!invitee,
        isTeamGame: false,
        comments: [],
        inviteOnly: inviteOnly,
        sport: selectedSport,
        intensity: intensity
      };

      setIsLoading(true);
      try {
        const newGameId = await createGame(gamePayload);
        const createdGame = { ...gamePayload, id: newGameId };
        addGame(createdGame);
        if (invitee) {
          await addGameToPendingInvites(invitee.id, newGameId);
          addGameInviteToPlayerContext(newGameId, invitee.id);
        } else {
          console.log('not a pending game');
          addGameToLocationContext(newGameId, selectedLocation);
          await addGameIdToLocation(selectedLocation, newGameId);
          await updatePointsForLoggedInUser(10);
          await updateGamesHostedForLoggedInUser(true);
          await updateTotalGamesForLocation(selectedLocation, true);
        }
        console.log('Game created successfully');
      } catch (error) {
        console.error('Error creating game:', error);
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
      <div className='gameCreationModal-content' onClick={stopPropagation}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <h2>{isEditMode ? 'Edit Game' : 'Create Game'}</h2>
            {invitee && <div className="form-group"><h3>Inviting {invitee.username}</h3></div>}
            <div className="form-group">
              <label>Location</label>
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {locations.map((location: Location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Title (Optional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group date-time-row"> 
              <div className="date-field">
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="time-field">
                <label>Start Time</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="time-field">
                <label>End Time</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Invite Only</label>
              <input type="checkbox" checked={inviteOnly} onChange={(e) => setInviteOnly(e.target.checked)} />
            </div>
            <div className="form-group">
              <label>Max Players - 0 is no max</label>
              <input type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} min="1" max={10} required />
            </div>
            <div className="form-group">
              <label>Sport</label>
              <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}>
                {sportsList.map((sport, index) => (
                  <option key={index} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Intensity</label>
              <select value={selectedSport} onChange={e => setIntensity(e.target.value)}>
                {intensityLevels.map((intensity, index) => (
                  <option key={index} value={intensity}>{intensity}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Game Description (Optional)</label>
              <textarea id="gameDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
            <button onClick={handleSave}>{isEditMode ? 'Save Changes' : 'Create Game'}</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

