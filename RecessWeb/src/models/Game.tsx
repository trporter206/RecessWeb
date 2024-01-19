export interface Game {
    id: string;
    locationId: string;
    players: string[]; // Array of User IDs
    time: Date;
    minimumSkill: number;
  }