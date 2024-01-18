// src/components/LandingPage.tsx
import { useEffect, useState } from 'react';
import fetchLocations from '../services/locationService';
import { Location } from '../models/Location';
import '../styles/main.css'
import { MapComponent } from '../components/MapComponent';

export const LandingPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const locationsData = await fetchLocations();
      setLocations(locationsData);
    };

    loadLocations();
  }, []);

return (
    <div className="main-container">
      <div className='title-container'>
        <h1>Welcome to Recess</h1>
        <MapComponent locations={locations} />
      </div>
    </div>
    );
};