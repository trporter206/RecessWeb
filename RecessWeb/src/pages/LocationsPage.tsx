// src/components/LandingPage.tsx
import { useEffect, useState } from 'react';
import fetchLocations from '../services/locationService';
import { generateRandomLocation } from '../services/locationService';
import { Location } from '../models/Location';
import '../styles/main.css'

export const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const locationsData = await fetchLocations();
      setLocations(locationsData);
    };

    loadLocations();
  }, []);

  const addRandomLocation = () => {
    const newLocation = generateRandomLocation();
    setLocations([...locations, newLocation]);
  };

return (
    <div className="main-container">
      <div className='title-container'>
        <h1>Discover Locations</h1>
      </div>
      <button onClick={addRandomLocation}>Add Random Location</button>
      <div className='list-container'>
        {locations.map(location => (
          <div key={location.id}>
            <h2>{location.name}</h2>
            <p>{location.description}</p>
          </div>
        ))}
      </div>
    </div>
    );
};