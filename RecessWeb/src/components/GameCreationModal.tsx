import React, { useState, useContext } from 'react';
import { createGame } from '../services/GameServices';
import { LocationsContext } from '../services/LocationsProvider'; // Correctly import the context
import { Location } from '../models/Location';

interface GameCreationModalProps {
  show: boolean;
  onClose: () => void;
  onGameCreated: () => void;
}

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, onGameCreated }) => {
  const { locations } = useContext(LocationsContext); // Use the existing LocationsContext

  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState('');

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
      await createGame(newGame);
      onGameCreated();
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
