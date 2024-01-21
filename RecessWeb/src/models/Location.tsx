export interface Location {
  id: string;
  name: string;
  description: string;
  games: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

  