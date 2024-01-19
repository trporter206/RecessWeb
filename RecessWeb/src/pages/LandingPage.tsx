import { useState, useContext } from 'react';
import { LocationsContext } from '../services/LocationsProvider';
import { MapComponent } from '../components/MapComponent';
import { LocationInfoModal } from '../components/Location Components/LocationInfoModal';
import { Location } from '../models/Location';
import { LocationsList } from '../components/Location Components/LocationsList';
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
      <div className="map-and-list-container">
        <div className="map-container">
          <MapComponent locations={locations} onMarkerClick={handleMarkerClick} />
        </div>
        <div className="list-container">
          <LocationsList locations={locations} />
        </div>
      </div>
      {selectedLocation && (
        <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />
      )}
    </div>
  );
};
