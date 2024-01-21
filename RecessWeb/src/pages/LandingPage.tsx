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
  const [gameSortMethod, setGameSortMethod] = useState('');
  const [displayedGames, setDisplayedGames] = useState(games);


  useEffect(() => {
    setDisplayedLocations(locations);
    setDisplayedGames(games); // Update displayed games whenever the games data changes
  }, [locations, games]);

  const handleSortChange = (event: { target: { value: string }; }) => {
    if (showGames) {
      setGameSortMethod(event.target.value);
      sortGames(event.target.value);
    } else {
      setSortMethod(event.target.value);
      sortLocations(event.target.value);
    }
  };

  const sortGames = (method: string) => {
    let sortedGames;
    switch (method) {
      case 'players':
        sortedGames = [...games].sort((a, b) => b.players.length - a.players.length);
        break;
      case 'alphabetical':
        sortedGames = [...games].sort((a, b) => {
          const locA = locations.find(loc => loc.id === a.locationId)?.name || '';
          const locB = locations.find(loc => loc.id === b.locationId)?.name || '';
          return locA.localeCompare(locB);
        });
        break;
      default:
        sortedGames = [...games];
    }
    setDisplayedGames(sortedGames); // Update the displayed games state
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
        <div className="sorting-dropdown">
        <label htmlFor="sort">
          Sort {showGames ? 'Games' : 'Locations'}: 
        </label>
        <select id="sort" value={showGames ? gameSortMethod : sortMethod} onChange={handleSortChange}>
          <option value="">Select...</option>
          {showGames ? (
            <>
              <option value="players">By Number of Players</option>
              <option value="alphabetical">Alphabetically by Location</option>
            </>
          ) : (
            <>
              <option value="alphabetically">Alphabetically</option>
              <option value="games">By Number of Games</option>
            </>
          )}
        </select>
       </div>
       {showGames ? (
        <GamesList games={displayedGames} onDeleteGame={handleDeleteGame} /> // Use displayedGames here
      ) : (
        <LocationsList locations={displayedLocations} />
      )}
      </div>
    </div>
  {selectedLocation && <LocationInfoModal location={selectedLocation} onClose={handleCloseModal} />}
</div>
);
};

