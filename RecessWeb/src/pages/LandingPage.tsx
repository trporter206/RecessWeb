// src/components/LandingPage.tsx
import { useEffect, useState } from 'react';
import fetchLocations from '../services/locationService';
import { Location } from '../models/Location';
import '../styles/main.css'

const generateRandomLocation = () => {
    const randomId = Math.random().toString(36).substring(2, 9); // Generate a random string
    const randomName = `Location ${randomId.toUpperCase()}`;
    const randomDescription = `Description for ${randomName}`;
  
    return {
      id: randomId,
      name: randomName,
      description: randomDescription,
      games: [] // Keeping games empty
    };
  };

export const LandingPage = () => {
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
        <h1>Welcome to Recess</h1>
      </div>
      <button onClick={addRandomLocation}>Add Random Location</button>
      <div className='list-container'>
        {locations.map(location => (
          <div key={location.id}>
            <h2>{location.name}</h2>
            <p>{location.description}</p>
            {/* Add more location details if needed */}
          </div>
        ))}
      </div>
    </div>
    );
};
