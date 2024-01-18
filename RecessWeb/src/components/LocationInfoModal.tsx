// LocationInfoModal component
import React from 'react';
import { Location } from '../models/Location'; // Import the Location type

interface LocationInfoModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationInfoModal: React.FC<LocationInfoModalProps> = ({ location, onClose }) => {
  const { name, description, games } = location;

  return (
    <div className="locationInfoModal-backdrop">
      <div className="locationInfoModal-content">
        <h3>{name}</h3>
        <p>{description}</p>
        <ul>
          {games.map(game => (
            <li key={game.toString()}>{game}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
