// src/components/GameCreationModal.tsx
import { useState, useEffect } from 'react';
import { createGame } from '../services/GameServices';
import { Location } from '../models/Location';
import fetchLocations from '../services/locationService'; // Import your fetchLocations service

interface GameCreationModalProps {
  show: boolean;
  onClose: () => void;
  onGameCreated: () => void;
}

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, onGameCreated }) => {
    const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchAndSetLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);
    };

    fetchAndSetLocations();
  }, []);

  const handleSave = async () => {
    if (!selectedLocation || !date) {
      // Handle validation error
      return;
    }

    const newGame = {
      locationId: selectedLocation,
      players: [], // Assuming empty players list
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
    <div style={{ /* Styles for your modal */ }}>
      <h2>Create Game</h2>
      <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
        {locations.map(location => (
          <option key={location.id} value={location.id}>{location.name}</option>
        ))}
      </select>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
