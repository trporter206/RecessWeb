import React, { useState, useContext, useEffect } from 'react';
import { createGame } from '../services/GameServices';
import { LocationsContext } from '../services/LocationsProvider';
import { Location } from '../models/Location';

interface GameCreationModalProps {
  show: boolean;
  onClose: () => void;
  onGameCreated: () => void;
}

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, onGameCreated }) => {
  const { locations, addGameToLocation } = useContext(LocationsContext);
  const [selectedLocation, setSelectedLocation] = useState(locations.length > 0 ? locations[0].id : '');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (locations.length > 0 && selectedLocation === '') {
      setSelectedLocation(locations[0].id);
    }
  }, [locations]);

  const handleSave = async () => {
    if (!selectedLocation || !date) {
      // Handle validation error
      return;
    }

    const newGame = {
      locationId: selectedLocation,
      players: [],
      time: new Date(date),
    };

    try {
      const newGameId = await createGame(newGame); // Ensure createGame returns the new game ID
      addGameToLocation(newGameId, selectedLocation);
      onGameCreated();
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
    <div>
      <h2>Create Game</h2>
      <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
        {locations.map((location: Location) => (
          <option key={location.id} value={location.id}>{location.name}</option>
        ))}
      </select>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
