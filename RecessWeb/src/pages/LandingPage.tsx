import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../services/DataProvider';
import { MapComponent } from '../components/Other Components/MapComponent';
import { LocationInfoModal } from '../components/Location Components/LocationInfoModal';
import { Location } from '../models/Location';
import { LocationsList } from '../components/Location Components/LocationsList';
import '../styles/main.css';
import { Game } from '../models/Game';
import { FilterBar } from '../components/Other Components/FilterBar';

export const LandingPage = () => {
  const { locations } = useContext(DataContext); // Use games from DataContext
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [displayedLocations, setDisplayedLocations] = useState(locations);


  useEffect(() => {
    setDisplayedLocations(locations); // Update displayed games whenever the games data changes
  }, [locations]);

  const handleMarkerClick = (item: Location | Game) => {
    let locationToShow;
  
    if ('name' in item) {
      // If item is a Location, use it directly
      locationToShow = item;
    } else {
      // If item is a Game, find the corresponding Location
      locationToShow = locations.find(loc => loc.id === item.locationId);
    }
  
    if (locationToShow) {
      setSelectedLocation(locationToShow);
    }
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  const handleFilterChange = (category: string, option: string) => {
    // Example filter logic, adjust based on your needs
    let filteredLocations = locations;

    if (category === "" && option === "") {
      setDisplayedLocations(locations);
      return;
    } else {
      if (category === "Type") {
        filteredLocations = locations.filter(location => location.type === option);
      }
      if (category === "Courts") {
        if (option === "3+") {
          filteredLocations = locations.filter(location => location.courtCount >= 3);
        } else {
          filteredLocations = locations.filter(location => location.courtCount == +option);
        }
      }
      if (category === "Has Lights") {
        filteredLocations = locations.filter(location => location.lights === (option === "Yes"));
      }
      if (category === "Games Scheduled") {
        filteredLocations = locations.filter(location => location.games.length > 0);
      }
      if (category === "Owned") {
        filteredLocations = locations.filter(location => location.isOwned === (option === "Yes"));
      }
    }

    setDisplayedLocations(filteredLocations);
  };

  return (
    <div className="main-container">
      <FilterBar onFilterChange={handleFilterChange}/>
      <div className="map-and-list-container">
        <div className="map-container">
          <MapComponent items={displayedLocations} onMarkerClick={handleMarkerClick} />
        </div>
        <div className="list-container">
          <div className="scrollable-list-container">
            <LocationsList locations={displayedLocations} />
          </div>
        </div>
      </div>
    {selectedLocation && <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />}
  </div>
  );
};

