import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../services/DataProvider';
import { MapComponent } from '../components/MapComponent';
import { LocationInfoModal } from '../components/Location Components/LocationInfoModal';
import { Location } from '../models/Location';
import { LocationsList } from '../components/Location Components/LocationsList';
import { GamesList } from '../components/Game Components/GamesList';
import '../styles/main.css';
import { Game } from '../models/Game';

export const LandingPage = () => {
  const { locations, games, removeGame } = useContext(DataContext); // Use games from DataContext
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [sortMethod, setSortMethod] = useState('');
  const [displayedLocations, setDisplayedLocations] = useState(locations);
  const [showGames, setShowGames] = useState(false);

  useEffect(() => {
    setDisplayedLocations(locations);
  }, [locations]);

  const handleSortChange = (event: { target: { value: string }; }) => {
    setSortMethod(event.target.value);
    sortLocations(event.target.value);
  };

  const sortLocations = (method: string) => {
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
  
  const handleDeleteGame = (gameId: string) => {
    removeGame(gameId);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
  };

  const handleToggleDisplay = () => {
    setShowGames(!showGames);
  };

  return (
    <div className="main-container">
      <div className="map-and-list-container">
        <div className="map-container">
          <MapComponent items={showGames ? games : locations} onMarkerClick={handleMarkerClick} />
        </div>
        <div className="list-container">
          <button onClick={handleToggleDisplay}>
            {showGames ? 'Show Locations' : 'Show Games'}
          </button>
          {showGames ? 
            <GamesList games={games} onDeleteGame={handleDeleteGame}/> 
            : 
            <div>
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
          }
        </div>
      </div>
      {selectedLocation && <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />}
    </div>
  );
};

