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
  updateGamePlayers: (gameId: string, userId: string, isJoining: boolean) => void;
  updateUserRatings: (targetUserId: string, raterId: string, rating: 1 | 0) => void;
  getAverageRating: (userId: string) => number;
}

export const DataContext = createContext<DataProviderType>({
  locations: [],
  games: [],
  users: [],
  setLocations: () => {},
  addGameToLocation: () => {},
  removeGameFromLocation: () => {},
  removeGame: () => {},
  addGame: () => {},
  updateGamePlayers: () => {},
  updateUserRatings: () => {},
  getAverageRating: () => 0,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await fetchUsers();
      const fetchedGames = await fetchGames();
      const fetchedLocations = await fetchLocations();

      setLocations(fetchedLocations);
      setGames(fetchedGames);
      setUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  const getAverageRating = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (!user || Object.keys(user.ratings).length === 0) {
      return 0; // Return 0 if user not found or has no ratings
    }
    const totalRatings = Object.values(user.ratings).reduce((acc, rating) => acc + rating, 0);
    const averageRating = totalRatings / Object.keys(user.ratings).length;
    return averageRating;
  };

  const updateUserRatings = (targetUserId: string, raterId: string, rating: 1 | 0) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === targetUserId) {
        // Check if there's an existing rating by the rater
        const existingRating = user.ratings[raterId];
        let updatedRatings = {...user.ratings};

        if (existingRating === rating) {
          // If the new rating is the same as the existing one, remove the rating
          delete updatedRatings[raterId];
        } else {
          // Otherwise, update or add the new rating
          updatedRatings[raterId] = rating;
        }

        return {...user, ratings: updatedRatings};
      }
      return user;
    }));
  };

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

  const updateGamePlayers = (gameId: string, userId: string, isJoining: boolean) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        const updatedPlayers = isJoining
          ? [...game.players, userId]
          : game.players.filter(playerId => playerId !== userId);
        return { ...game, players: updatedPlayers };
      }
      return game;
    }));
  };

  const value = {
    locations,
    games,
    users,
    setLocations,
    addGameToLocation,
    removeGameFromLocation,
    removeGame,
    addGame,
    updateGamePlayers,
    updateUserRatings,
    getAverageRating,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
