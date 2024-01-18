import { Game } from "./Game";

export interface Location {
  id: string;
  name: string;
  description: string;
  games: String[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

  