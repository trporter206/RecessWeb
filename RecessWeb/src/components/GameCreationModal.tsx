import React, { useState, useContext, useEffect } from 'react';
import { createGame } from '../services/GameServices';
import { LocationsContext } from '../services/LocationsProvider';
import { Location } from '../models/Location';

interface GameCreationModalProps {
    show: boolean;
    onClose: () => void;
    onGameCreated: () => void;
    locationId?: string; // Optional prop for default location ID
  }

export const GameCreationModal: React.FC<GameCreationModalProps> = ({ show, onClose, onGameCreated, locationId }) => {
  const { locations, addGameToLocation } = useContext(LocationsContext);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Set the default selected location to the provided locationId or the first location in the list
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
    <div className='gameCreationModal-backdrop' onClick={handleClose}>
        <div className='gameCreationModal-content' onClick={stopPropagation}>
            <h2>Create Game</h2>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            {locations.map((location: Location) => (
            <option key={location.id} value={location.id}>{location.name}</option>
            ))}
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
        </div>
    </div>
  );
};
