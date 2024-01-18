import { useContext } from 'react';
import { LocationsContext } from '../services/LocationsProvider'; // Import the context
import '../styles/main.css';
import { MapComponent } from '../components/MapComponent';

export const LandingPage = () => {
  // Use LocationsContext to access locations
  const { locations } = useContext(LocationsContext);

  return (
    <div className="main-container">
      <div className='title-container'>
        <h1>Welcome to Recess</h1>
        <MapComponent locations={locations} />
      </div>
    </div>
  );
};
