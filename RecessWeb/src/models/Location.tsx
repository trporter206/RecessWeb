export interface Location {
  id: string;
  name: string;
  description: string;
  address: string;
  type: string;
  courtCount: number;
  lights: boolean;
  games: string[];
  isOwned: boolean;
  owners: string[];
  totalGames: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

  