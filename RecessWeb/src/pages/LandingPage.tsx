import { useState, useContext } from 'react';
import { LocationsContext } from '../services/LocationsProvider';
import { MapComponent } from '../components/MapComponent';
import { LocationInfoModal } from '../components/Location Components/LocationInfoModal';
import { Location } from '../models/Location';
import '../styles/main.css';

export const LandingPage = () => {
  const { locations } = useContext(LocationsContext);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="main-container">
      <div className='title-container'>
        <h1>Welcome to Recess</h1>
        <MapComponent locations={locations} onMarkerClick={handleMarkerClick} />
        {selectedLocation && (
          <LocationInfoModal
            location={selectedLocation}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};
