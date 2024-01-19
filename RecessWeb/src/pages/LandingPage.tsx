import { useState, useContext, useEffect, SetStateAction } from 'react';
import { LocationsContext } from '../services/LocationsProvider';
import { MapComponent } from '../components/MapComponent';
import { LocationInfoModal } from '../components/Location Components/LocationInfoModal';
import { Location } from '../models/Location';
import { LocationsList } from '../components/Location Components/LocationsList';
import '../styles/main.css';

export const LandingPage = () => {
  const { locations } = useContext(LocationsContext);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [sortMethod, setSortMethod] = useState('');
  const [displayedLocations, setDisplayedLocations] = useState(locations);

  useEffect(() => {
    setDisplayedLocations(locations);
  }, [locations]);

  const handleSortChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSortMethod(event.target.value);
    sortLocations(event.target.value);
  };

  const sortLocations = (method: SetStateAction<string>) => {
    let sortedLocations;
    switch (method) {
      case 'alphabetically':
        sortedLocations = [...locations].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'games':
        sortedLocations = [...locations].sort((a, b) => b.games.length - a.games.length);
        break;
      default:
        sortedLocations = [...locations];
    }
    setDisplayedLocations(sortedLocations);
  };

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
        <div className="sorting-dropdown">
        <label htmlFor="sort">Sort Locations: </label>
        <select id="sort" value={sortMethod} onChange={handleSortChange}>
          <option value="">Select...</option>
          <option value="alphabetically">Alphabetically</option>
          <option value="games">By Number of Games</option>
        </select>
        </div>
          <LocationsList locations={displayedLocations} />
        </div>
      </div>
      {selectedLocation && (
        <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />
      )}
    </div>
  );
};
