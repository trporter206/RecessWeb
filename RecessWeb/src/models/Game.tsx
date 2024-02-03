export interface Game {
    id: string;
    locationId: string;
    players: string[]; // Array of User IDs
    time: Date;
    hostId: string;
    minimumPoints: number;
    description: string;
    pending: boolean;
  }