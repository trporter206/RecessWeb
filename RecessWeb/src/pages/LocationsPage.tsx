import { useContext } from 'react';
import { LocationsContext } from '../services/LocationsProvider'; // Import the context
import '../styles/main.css';
import { LocationsList } from '../components/LocationsList';

export const LocationsPage = () => {
  // Use LocationsContext to access locations
  const { locations } = useContext(LocationsContext);

  return (
    <div className="main-container">
      <div className='title-container'>
        <h1>Discover Locations</h1>
      </div>
      <div className='list-container'>
        <LocationsList locations={locations} />
      </div>
    </div>
  );
};
