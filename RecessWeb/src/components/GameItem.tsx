import React from 'react';
import '../styles/main.css';
import { deleteGame } from '../services/GameServices';

interface GameItemProps {
  id: string; // Add this line
  locationId: string;
  players: Array<[]>;
  time: Date;
}

export const GameItem: React.FC<GameItemProps & { onDelete: (id: string) => void }> = ({ id, locationId, players, time, onDelete }) => {
    const handleDelete = async () => {
      try {
        await deleteGame(id);
        onDelete(id); // Call the passed callback function
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