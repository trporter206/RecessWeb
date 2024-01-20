import React, { createContext, useState, useEffect } from 'react';
import { fetchLocations } from './locationService';
import { fetchGames } from './GameServices';
import { fetchUsers } from './UserServices';
import { Location } from '../models/Location';
import { Game } from '../models/Game';
import { User } from '../models/User';

interface DataProviderType {
  locations: Location[];
  games: Game[];
  users: User[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  addGameToLocation: (gameId: string, locationId: string) => void;
  removeGameFromLocation: (gameId: string, locationId: string) => void;
  removeGame: (gameId: string) => void;
  addGame: (newGame: Game) => void; // Added function
}

export const DataContext = createContext<DataProviderType>({
  locations: [],
  games: [],
  users: [],
  setLocations: () => {},
  addGameToLocation: () => {},
  removeGameFromLocation: () => {},
  removeGame: () => {},
  addGame: () => {} // Added function
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLocations = await fetchLocations();
      const fetchedGames = await fetchGames();
      const fetchedUsers = await fetchUsers();

      setLocations(fetchedLocations);
      setGames(fetchedGames);
      setUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  const addGameToLocation = (gameId: string, locationId: string) => {
    setLocations(prevLocations =>
      prevLocations.map(location =>
        location.id === locationId
          ? { ...location, games: [...location.games, gameId] }
          : location
      )
    );
  };

  const removeGameFromLocation = (gameId: string, locationId: string) => {
    setLocations(prevLocations =>
      prevLocations.map(location =>
        location.id === locationId
          ? { ...location, games: location.games.filter(id => id !== gameId) }
          : location
      )
    );
  };

  const addGame = (newGame: Game) => {
    setGames(prevGames => [...prevGames, newGame]);
  };

  const removeGame = (gameId: string) => {
    setGames(prevGames => prevGames.filter(game => game.id !== gameId));
  }; // Added function

  const value = {
    locations,
    games,
    users,
    setLocations,
    addGameToLocation,
    removeGameFromLocation,
    removeGame,
    addGame // Added function
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
