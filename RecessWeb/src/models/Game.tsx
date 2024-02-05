export interface Game {
    id: string;
    locationId: string;
    players: string[]; // Array of User IDs
    date: Date;
    startTime: string;
    endTime: string;
    skillMinimum: number;
    skillMaximum: number;
    maxPlayers: number;
    title: string;
    hostId: string;
    minimumPoints: number;
    description: string;
    pending: boolean;
    // isTeamGame: boolean;
  }