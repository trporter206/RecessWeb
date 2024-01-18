import React, { useContext } from 'react';
import '../styles/main.css';
import { deleteGame } from '../services/GameServices';
import { LocationsContext } from '../services/LocationsProvider';

interface GameItemProps {
  id: string;
  locationId: string;
  players: Array<[]>;
  time: Date;
}

export const GameItem: React.FC<GameItemProps & { onDelete: (id: string) => void }> = ({ id, locationId, players, time, onDelete }) => {
    const { removeGameFromLocation } = useContext(LocationsContext);
    const handleDelete = async () => {
      try {
        await deleteGame(id);
        onDelete(id);
        removeGameFromLocation(id, locationId);
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    };

  return (
    <div className='location-item'>
      <h3>{locationId}</h3>
      <p>{players}</p>
      <p>{time.toDateString()}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};