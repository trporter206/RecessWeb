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
  const { locations } = useContext(DataContext);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [displayedLocations, setDisplayedLocations] = useState(locations);
  const [searchText, setSearchText] = useState('');
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [locations, searchText]);

  const handleToggleView = (showMap: boolean) => {
    setShowMap(showMap);
  };

  const handleSearch = (query: string) => {
    setSearchText(query);
  };

  const applyFiltersAndSearch = (filters: { [key: string]: string } = {}) => {
    console.log(locations)
    let filteredLocations = locations;
    Object.entries(filters).forEach(([category, option]) => {
      switch (category) {
        case "Type":
          filteredLocations = filteredLocations.filter(location => location.type === option);
          break;
        case "Courts":
          if (option === "3+") {
            filteredLocations = filteredLocations.filter(location => location.courtCount >= 3);
          } else {
            const courtCount = parseInt(option, 10);
            filteredLocations = filteredLocations.filter(location => location.courtCount === courtCount);
          }
          break;
        case "Has Lights":
          const hasLights = option === "Yes";
          filteredLocations = filteredLocations.filter(location => location.lights === hasLights);
          break;
        case "Games Scheduled":
          const gamesScheduled = option === "Yes";
          filteredLocations = filteredLocations.filter(location => gamesScheduled ? location.games.length > 0 : location.games.length === 0);
          break;
        case "Owned":
          const isOwned = option === "Yes";
          filteredLocations = filteredLocations.filter(location => location.isOwned === isOwned);
          break;
        default:
          break;
      }
    });
    // Apply search filtering
    if (searchText) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchText.toLowerCase()) ||
          location.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setDisplayedLocations(filteredLocations);
  };

  const handleMarkerClick = (item: Location | Game) => {
    let locationToShow = 'name' in item ? item : locations.find(loc => loc.id === item.locationId);
    setSelectedLocation(locationToShow || null);
  };

  const handleCloseModal = () => setSelectedLocation(null);

  const handleFiltersChange = (filters: { [key: string]: string }) => {
    let filteredLocations = locations;
  
    Object.entries(filters).forEach(([category, option]) => {
      if (category === "Type") {
        filteredLocations = filteredLocations.filter((location) => location.type === option);
      } else if (category === "Courts") {
        const courtCount = option === "3+" ? 3 : parseInt(option, 10);
        filteredLocations = filteredLocations.filter((location) =>
          option === "3+" ? location.courtCount >= courtCount : location.courtCount === courtCount
        );
      } else if (category === "Has Lights") {
        filteredLocations = filteredLocations.filter((location) => location.lights === (option === "Yes"));
      } else if (category === "Owned") {
        filteredLocations = filteredLocations.filter((location) => location.isOwned === (option === "Yes"));
      } else if (category === "Games Scheduled") {
        filteredLocations = filteredLocations.filter((location) => location.games.length > 0 === (option === "Yes"));
      } // Add other filters as needed
    });
  
    if (searchText) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchText.toLowerCase()) ||
          location.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setDisplayedLocations(filteredLocations);
  };

  return (
    <>
    <div className="filter-bar-wrapper">
        <FilterBar onFiltersChange={handleFiltersChange} onSearch={handleSearch} onToggleView={handleToggleView} />
      </div>
      <div className="landing-container">
      <div className="map-and-list-container">
        <div className={`map-container ${showMap ? "" : "hidden-sm"}`}>
          <div className="map-container">
            <MapComponent items={displayedLocations} onMarkerClick={handleMarkerClick} />
          </div>
        </div>
        <div className={`list-container ${showMap ? "hidden-sm" : ""} landing-list-container`}>
          <div className="scrollable-list-container">
            <LocationsList locations={displayedLocations} />
          </div>
        </div>
      </div>
      {selectedLocation && <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />}
    </div>
    </>
  );
};
