import React, { useState, useContext, useEffect } from 'react';
import { createGame } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { Location } from '../../models/Location';
import { UserContext } from '../../services/UserContext';
import { addGameToPendingInvites, updateGamesHostedForLoggedInUser, updatePointsForLoggedInUser } from '../../services/UserServices';
import { addGameIdToLocation, updateTotalGamesForLocation } from '../../services/locationService';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../models/User';

interface GameCreationModalProps {
  show: boolean;
  onClose: () => void;
  locationId?: string; // Optional prop for default location ID
  invitee?: User;
}

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, locationId, invitee }) => {
  const { locations, addGameToLocationContext, addGame } = useContext(DataContext);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>("12:00");
  const [endTime, setEndTime] = useState<string>("13:00");
  const [maxTeams, setMaxTeams] = useState<number>(2); // For team games
  const [maxPlayers, setMaxPlayers] = useState<number>(10); // For non-team games
  const [skillMinimum, setSkillMinimum] = useState<number>(1);
  const [skillMaximum, setSkillMaximum] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [minimumPoints, setMinimumPoints] = useState<number>(0);
  const [isTeamGame, setIsTeamGame] = useState<boolean>(false); // New state for "Teams Only"
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isUserOnTeam = profile?.teams && profile.teams.length > 0;

  useEffect(() => {
    const defaultLocationId = locationId || (locations.length > 0 ? locations[0].id : '');
    setSelectedLocation(defaultLocationId);
  }, [locations, locationId]);

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleSave = async () => {
    if (!selectedLocation || !date || !startTime || !endTime || !user) {
      // Handle validation error
      return;
    }

    // Adjust payload based on whether it's a team game
    const gamePayload = {
      locationId: selectedLocation,
      players: invitee ? [invitee.id] : [],
      date: new Date(date),
      startTime,
      endTime,
      skillMinimum,
      skillMaximum,
      maxPlayers: isTeamGame ? maxTeams : 0, // Use maxTeams for team games
      title,
      hostId: user.uid,
      minimumPoints: isTeamGame ? 0 : minimumPoints, // Hide minimum points for team games
      description,
      pending: !!invitee,
      isTeamGame, // Include the isTeamGame flag
    };

    setIsLoading(true);
    try {
      const newGameId = await createGame(gamePayload);
      const createdGame = { ...gamePayload, id: newGameId };
      addGame(createdGame);
      if (invitee) {
        await addGameToPendingInvites(invitee.id, newGameId);
      } else {
        addGameToLocationContext(newGameId, selectedLocation);
        await addGameIdToLocation(newGameId, selectedLocation);
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
            <h2>Create Game</h2>
            {invitee && <div className="form-group"><h3>Inviting {invitee.username}</h3></div>}
            <div className="form-group">
              <label>Location: </label>
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {locations.map((location: Location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
              <div className="form-group date-time-row"> {/* Added class for styling */}
              <div className="date-field">
                <label>Date: </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="time-field">
                <label>Start Time: </label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="time-field">
                <label>End Time: </label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="form-group teams-max-row"> {/* Added class for styling */}
              {isUserOnTeam && (
                  <div className="teams-only-field">
                    <label>Teams Only:</label>
                    <input type="checkbox" checked={isTeamGame} onChange={(e) => setIsTeamGame(e.target.checked)} />
                  </div>
              )}
              <div className="max-players-field">
                <label>{isTeamGame ? "Max Teams" : "Max Players"}: </label>
                <input type="number" value={isTeamGame ? maxTeams : maxPlayers} onChange={e => isTeamGame ? setMaxTeams(Number(e.target.value)) : setMaxPlayers(Number(e.target.value))} min="1" max={isTeamGame ? 2 : 10} required />
              </div>
            </div>
            {!isTeamGame && (
              <div className="form-group">
                <label>Minimum Points (Optional): </label>
                <input type="number" value={minimumPoints} onChange={e => setMinimumPoints(Number(e.target.value))} min="0" />
              </div>
            )}
            <div className="form-group skill-min-max-row"> {/* Added class for styling */}
              <div className="skill-min-field">
                <label>Skill Minimum (Optional): </label>
                <input type="number" value={skillMinimum} onChange={e => setSkillMinimum(Number(e.target.value))} min="1" max="5" />
              </div>
              <div className="skill-max-field">
                <label>Skill Maximum (Optional): </label>
                <input type="number" value={skillMaximum} onChange={e => setSkillMaximum(Number(e.target.value))} min="1" max="5" />
              </div>
            </div>
            <div className="form-group">
              <label>Title (Optional): </label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Game Description (Optional):</label>
              <textarea id="gameDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};