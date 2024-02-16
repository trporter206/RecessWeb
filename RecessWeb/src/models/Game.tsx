import firebase from 'firebase/compat/app';

export interface Game {
    id: string;
    locationId: string;
    players: string[]; // Array of User IDs
    teams: string[]; // Array of Team IDs
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
    isTeamGame: boolean;
    comments: GameComment[];
    inviteOnly: boolean;
}

export interface GameComment {
  userId: string;
  text: string;
  timestamp: firebase.firestore.Timestamp;
  id: string;
}