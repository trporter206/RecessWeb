export interface Location {
  id: string;
  name: string;
  description: string;
  games: string[];
  totalGames: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

  