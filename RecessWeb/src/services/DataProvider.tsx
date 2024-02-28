import React, { createContext, useState, useEffect } from 'react';
import { fetchLocations } from './locationService';
import { fetchGames } from './GameServices';
import { fetchUsers } from './UserServices';
import { fetchTeams } from './TeamServices';
import { Location } from '../models/Location';
import { Game, GameComment } from '../models/Game';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Club } from '../models/Club';
import { fetchClubs } from './ClubServices';

export const sportsList = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Baseball"
];

interface DataProviderType {
  locations: Location[];
  games: Game[];
  users: User[];
  teams: Team[];
  clubs: Club[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  addGameToLocationContext: (gameId: string, locationId: string) => void;
  removeGameFromLocation: (gameId: string, locationId: string) => void;
  removeGame: (gameId: string) => void;
  addGame: (newGame: Game) => void; // Added function
  updateGamePlayers: (gameId: string, userId: string, isJoining: boolean) => void;
  updateUserRatings: (targetUserId: string, raterId: string, rating: 1 | 0) => void;
  getAverageRating: (userId: string) => number;
  getUsernameById: (userId: string) => string | undefined;
  toggleGamePendingStatusContext: (gameId: string) => void;
  addTeam: (newTeam: Team) => void;
  addMemberToTeamContext: (teamId: string, userId: string) => void;
  removeMemberFromTeamContext: (teamId: string, userId: string) => void;
  addTeamInviteContext: (teamId: string, userId: string) => void;
  removeTeamInviteContext: (teamId: string, userId: string) => void;
  addTeamToPlayerContext: (teamId: string, userId: string) => void;
  removeTeamFromPlayerContext: (teamId: string, userId: string) => void;
  addTeamToGameContext: (teamId: string, gameId: string) => void;
  removeTeamFromGameContext: (teamId: string, gameId: string) => void;
  addCommentToGameContext: (gameId: string, comment: GameComment) => void;
  removeCommentFromGameContext: (gameId: string, commentId: string) => void;
  addClubContext: (club: Club) => void;
  removeClubContext: (clubId: string) => void;
  addGameToClubContext: (gameId: string, clubId: string) => void;
  removeGameFromClubContext: (gameId: string, clubId: string) => void;
  addMemberToClubContext: (clubId: string, userId: string) => void;
  removeMemberFromClubContext: (clubId: string, userId: string) => void;
  updateGameContext: (gameId: string, updatedGame: Game) => void;
  updateTeamContext: (teamId: string, updatedTeam: Team) => void;
  updateClubContext: (clubId: string, updatedClub: Club) => void;
  updateUserContext: (userId: string, updatedUser: User) => void;
  addPlayerToGameContext: (gameId: string, userId: string) => void;
  removePlayerFromGameContext: (gameId: string, userId: string) => void;
  addGameInviteToPlayerContext: (gameId: string, userId: string) => void;
}

export const DataContext = createContext<DataProviderType>({
  locations: [],
  games: [],
  users: [],
  teams: [],
  clubs: [],
  setLocations: () => {},
  addGameToLocationContext: () => {},
  removeGameFromLocation: () => {},
  removeGame: () => {},
  addGame: () => {},
  updateGamePlayers: () => {},
  updateUserRatings: () => {},
  getAverageRating: () => 0,
  getUsernameById: () => '',
  toggleGamePendingStatusContext: () => {},
  addTeam: () => {},
  addMemberToTeamContext: () => {},
  removeMemberFromTeamContext: () => {},
  addTeamInviteContext: () => {},
  removeTeamInviteContext: () => {},
  addTeamToPlayerContext: () => {},
  removeTeamFromPlayerContext: () => {},
  addTeamToGameContext: () => {},
  removeTeamFromGameContext: () => {},
  addCommentToGameContext: () => {},
  removeCommentFromGameContext: () => {},
  addClubContext: () => {},
  removeClubContext: () => {},
  addGameToClubContext: () => {},
  removeGameFromClubContext: () => {},
  addMemberToClubContext: () => {},
  removeMemberFromClubContext: () => {},
  updateGameContext: () => {},
  updateTeamContext: () => {},
  updateClubContext: () => {},
  updateUserContext: () => {},
  addPlayerToGameContext: () => {},
  removePlayerFromGameContext: () => {},
  addGameInviteToPlayerContext: () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await fetchUsers();
      const fetchedTeams = await fetchTeams();
      const fetchedGames = await fetchGames();
      const fetchedClubs = await fetchClubs();
      const fetchedLocations = await fetchLocations();

      setLocations(fetchedLocations);
      setGames(fetchedGames);
      setUsers(fetchedUsers);
      setTeams(fetchedTeams);
      setClubs(fetchedClubs);
    };

    fetchData();
  }, []);

  const addGameInviteToPlayerContext = (gameId: string, userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, pendingInvites: [...user.pendingInvites, gameId] };
      }
      return user;
    }));
  }

  const addPlayerToGameContext = (gameId: string, userId: string) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return { ...game, players: [...game.players, userId] };
      }
      return game;
    }));
  }

  const removePlayerFromGameContext = (gameId: string, userId: string) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return { ...game, players: game.players.filter(playerId => playerId !== userId) };
      }
      return game;
    }));
  }

  const updateUserContext = (userId: string, updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return updatedUser;
      }
      return user;
    }));
  };

  const updateClubContext = (clubId: string, updatedClub: Club) => {
    setClubs(prevClubs => prevClubs.map(club => {
      if (club.id === clubId) {
        return updatedClub;
      }
      return club;
    }));
  }

  const updateTeamContext = (teamId: string, updatedTeam: Team) => {
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === teamId) {
        return updatedTeam;
      }
      return team;
    }));
  };

  const updateGameContext = (gameId: string, updatedGame: Game) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return updatedGame;
      }
      return game;
    }));
  };

  const addMemberToClubContext = (clubId: string, userId: string) => {
    setClubs(prevClubs => prevClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, members: [...club.members, userId] };
      }
      return club;
    }));
  };

  const removeMemberFromClubContext = (clubId: string, userId: string) => {
    setClubs(prevClubs => prevClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, members: club.members.filter(memberId => memberId !== userId) };
      }
      return club;
    }));
  };

  const addGameToClubContext = (gameId: string, clubId: string) => {
    setClubs(prevClubs => prevClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, games: [...club.games, gameId] };
      }
      return club;
    }));
  };

  const removeGameFromClubContext = (gameId: string, clubId: string) => {
    setClubs(prevClubs => prevClubs.map(club => {
      if (club.id === clubId) {
        return { ...club, games: club.games.filter(game => game !== gameId) };
      }
      return club;
    }));
  };

  const addClubContext = (club: Club) => {
    setClubs(prevClubs => [...prevClubs, club]);
  };

  const removeClubContext = (clubId: string) => {
    setClubs(prevClubs => prevClubs.filter(club => club.id !== clubId));
  };

  const addCommentToGameContext = (gameId: string, comment: GameComment) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        const updatedComments = [...game.comments, comment];
        return { ...game, comments: updatedComments };
      }
      return game;
  }));
}

const removeCommentFromGameContext = (gameId: string, commentId: string) => {
  setGames(prevGames => prevGames.map(game => {
    if (game.id === gameId) {
      // Filter out the comment by its ID
      const newComments = game.comments.filter(comment => comment.id !== commentId);
      return { ...game, comments: newComments };
    }
    return game;
  }));
}

  const addTeamToGameContext = (teamId: string, gameId: string) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return { ...game, teams: [...game.teams, teamId] };
      }
      return game;
    }));
  };

  const removeTeamFromGameContext = (teamId: string, gameId: string) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return { ...game, teams: game.teams.filter(gameTeamId => gameTeamId !== teamId) };
      }
      return game;
    }));
  }

  const addTeamToPlayerContext = (teamId: string, userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const updatedTeams = [...(user.teams || []), teamId];
        return { ...user, teams: updatedTeams };
      }
      return user;
    }));
  };
  

  const removeTeamFromPlayerContext = (teamId: string, userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, teams: user.teams.filter(team => team !== teamId) };
      }
      return user;
    }));
  };

  const removeTeamInviteContext = (teamId: string, userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, pendingTeamInvites: user.pendingTeamInvites.filter(invite => invite !== teamId) };
      }
      return user;
    }));
  }

  const addTeamInviteContext = (teamId: string, userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return { ...user, pendingTeamInvites: [...user.pendingTeamInvites, teamId] };
      }
      return user;
    }));
  }

  const addMemberToTeamContext = (teamId: string, userId: string) => {
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: [...team.members, userId] };
      }
      return team;
    }));
  };

  const removeMemberFromTeamContext = (teamId: string, userId: string) => {
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: team.members.filter(memberId => memberId !== userId) };
      }
      return team;
    }));
  };

  const addTeam = (newTeam: Team) => {
    setTeams(prevTeams => [...prevTeams, newTeam]);
  }

  const toggleGamePendingStatusContext = (gameId: string) => {
    setGames((currentGames) => {
      // Find the index of the game that matches the gameId
      const gameIndex = currentGames.findIndex((game) => game.id === gameId);
      if (gameIndex === -1) {
        console.error("Game not found");
        return currentGames; // Return the current state if game not found
      }
      // Clone the currentGames array
      const updatedGames = [...currentGames];
      // Toggle the 'pending' status of the game
      updatedGames[gameIndex] = {
        ...updatedGames[gameIndex],
        pending: !updatedGames[gameIndex].pending,
      };
  
      return updatedGames; // Return the updated games array
    });
  };
  

  const getUsernameById = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.username : undefined;
  };

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

  const addGameToLocationContext = (gameId: string, locationId: string) => {
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
    teams,
    clubs,
    setLocations,
    addGame,
    addTeam,
    addClubContext,
    addGameToLocationContext,
    addMemberToTeamContext,
    addTeamInviteContext,
    addTeamToPlayerContext,
    addTeamToGameContext,
    addCommentToGameContext,
    addGameToClubContext,
    addMemberToClubContext,
    addPlayerToGameContext,
    addGameInviteToPlayerContext,
    removeGameFromLocation,
    removeGame,
    removeMemberFromTeamContext,
    removeTeamInviteContext,
    removeTeamFromPlayerContext,
    removeTeamFromGameContext,
    removeCommentFromGameContext,
    removeClubContext,
    removeGameFromClubContext,
    removeMemberFromClubContext,
    removePlayerFromGameContext,
    updateGamePlayers,
    updateUserRatings,
    updateGameContext,
    updateTeamContext,
    updateClubContext,
    updateUserContext,
    getAverageRating,
    getUsernameById,
    toggleGamePendingStatusContext,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
