export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  pickleballSkill: number;
  gender: string;
  age: number;
  email: string;
  points: number;
  rating: number;
  gamesHosted: number;
  gamesJoined: number;
  interestedSports: string[];
  ratings: Record<string, number>;
  network: string[];
  favoriteLocations: string[];
  pendingInvites: string[];
  pendingTeamInvites: string[];
  teams: string[];
  clubs: string[];
  ownedLocations: string[];
  currentGames: string[];
}