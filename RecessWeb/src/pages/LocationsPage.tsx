// src/components/LandingPage.tsx
import { useEffect, useState } from 'react';
import fetchLocations from '../services/locationService';
import { generateRandomLocation } from '../services/locationService';
import { Location } from '../models/Location';
import '../styles/main.css'
import { LocationsList } from '../components/LocationsList';

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
        <LocationsList locations={locations} />
      </div>
    </div>
    );
};