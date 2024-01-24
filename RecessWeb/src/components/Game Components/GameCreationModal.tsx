import React, { useState, useContext, useEffect } from 'react';
import { createGame } from '../../services/GameServices';
import { DataContext } from '../../services/DataProvider';
import { Location } from '../../models/Location';
import { UserContext } from '../../services/UserContext';

interface GameCreationModalProps {
  show: boolean;
  onClose: () => void;
  onGameCreated: () => void;
  locationId?: string; // Optional prop for default location ID
}

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, onGameCreated, locationId }) => {
  const { locations, addGameToLocation, addGame } = useContext(DataContext);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default date set to today
  const userContext = useContext(UserContext);
  const user = userContext ? userContext.user : null;
  const profile = userContext ? userContext.profile : null;
  const [minimumPoints, setMinimumPoints] = useState(0);
  const maxPoints = profile ? profile.points : 0;

  useEffect(() => {
    const defaultLocationId = locationId || (locations.length > 0 ? locations[0].id : '');
    setSelectedLocation(defaultLocationId);
  }, [locations, locationId]);

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  const handleSave = async () => {
    if (!selectedLocation || !date || !user) {
      // Handle validation error
      return;
    }

    const newGame = {
      locationId: selectedLocation,
      players: [],
      time: new Date(date),
      hostId: user.uid,
      minimumPoints,
    };

    try {
      const newGameId = await createGame(newGame, userContext.updateTotalGames);
      const createdGame = { ...newGame, id: newGameId };
      addGame(createdGame);
      addGameToLocation(newGameId, selectedLocation);
      onGameCreated();
      if (userContext.updatePoints) {
        userContext.updatePoints(10);
      }
      console.log('Game created successfully');
    } catch (error) {
      console.error('Error creating game:', error);
    }

    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className='gameCreationModal-backdrop' onClick={handleClose}>
        <div className='gameCreationModal-content' onClick={stopPropagation}>
            <h2>Create Game</h2>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            {locations.map((location: Location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
            ))}
            </select>
            <div>
              <label>Minimum Points: </label>
              <input 
                type="number" 
                value={minimumPoints} 
                onChange={e => setMinimumPoints(Math.min(parseInt(e.target.value) || 0, maxPoints))} 
                min="0"
              />
            </div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
        </div>
    </div>
  );
};
