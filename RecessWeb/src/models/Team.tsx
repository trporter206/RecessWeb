export interface Team {
    id: string;
    name: string;
    members: string[]; 
    skill: number;
    wins: number;
    losses: number;
    sport: string;
    availableLocations: string[];
    availableTimes: string[];
    lookingForPlayers: boolean;
    joinInstructions: string;
}