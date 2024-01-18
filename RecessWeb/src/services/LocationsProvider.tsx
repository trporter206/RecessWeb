import React, { createContext, useState, useEffect } from 'react';
import fetchLocations from '../services/locationService';
import { Location } from '../models/Location';

interface LocationsContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  addGameToLocation: (gameId: string, locationId: string) => void;
  removeGameFromLocation: (gameId: string, locationId: string) => void;
}

export const LocationsContext = createContext<LocationsContextType>({
  locations: [],
  setLocations: () => {},
  addGameToLocation: () => {}, // Dummy implementation
  removeGameFromLocation: () => {}, // Dummy implementation
});

export const LocationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  // Fetch locations when the component mounts
  useEffect(() => {
    const getLocations = async () => {
      const fetchedLocations = await fetchLocations();
      setLocations(fetchedLocations);
    };

    getLocations();
  }, []);

  // Function to add a game to a location
  const addGameToLocation = (gameId: string, locationId: string) => {
    setLocations(prevLocations =>
      prevLocations.map(location =>
        location.id === locationId
          ? { ...location, games: [...location.games, gameId] }
          : location
      )
    );
  };

  // Function to remove a game from a location
  const removeGameFromLocation = (gameId: string, locationId: string) => {
    setLocations(prevLocations =>
      prevLocations.map(location =>
        location.id === locationId
          ? { ...location, games: location.games.filter(id => id !== gameId) }
          : location
      )
    );
  };

  return (
    <LocationsContext.Provider value={{ locations, setLocations, addGameToLocation, removeGameFromLocation }}>
      {children}
    </LocationsContext.Provider>
  );
};
