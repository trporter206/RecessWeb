export interface Team {
    id: string;
    name: string;
    creator: string;
    members: string[]; 
    skill: number;
    wins: number;
    losses: number;
    sport: string;
    availableLocations: string[];
    availableTimes: string[];
    pendingChallenges: string[];
    lookingForPlayers: boolean;
    joinInstructions: string;
}