// LocationItem component
import React from 'react';
import { Location } from '../models/Location'; // Import the Location type

interface LocationItemProps {
  location: Location;
}

export const LocationItem: React.FC<LocationItemProps> = ({ location }) => {
  const { name, description, games } = location; // Destructure the properties from location object

  return (
    <div className='location-item'>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Number of Games: {games.length}</p>
    </div>
  );
};
