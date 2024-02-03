export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  points: number;
  rating: number;
  gamesHosted: number;
  gamesJoined: number;
  ratings: Record<string, number>;
  network: string[];
  favoriteLocations: string[];
  pendingInvites: string[];
}