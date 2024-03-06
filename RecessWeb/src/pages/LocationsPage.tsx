import { useContext } from 'react';
import { DataContext } from '../services/DataProvider'; // Import the context
import '../styles/main.css';
import { LocationsList } from '../components/Location Components/LocationsList';

export const LocationsPage = () => {
  // Use LocationsContext to access locations
  const data = useContext(DataContext);

  return (
    <div>
      <h1>Discover Locations</h1>
      <div className='list-container'>
        <LocationsList locations={data.locations} />
      </div>
    </div>
  );
};
