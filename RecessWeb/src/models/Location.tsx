import { Game } from "./Game";

export interface Location {
  id: string;
  name: string;
  description: string;
  games: Game[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

  