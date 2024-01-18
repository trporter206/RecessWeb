import React from 'react';
import '../styles/main.css';

interface LocationItemProps {
  name: string;
  description: string;
  // Add other properties of the location if needed
}

export const LocationItem: React.FC<LocationItemProps> = ({ name, description }) => {
  return (
    <div className='location-item'>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};
