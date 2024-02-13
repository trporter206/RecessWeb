export interface Club {
    id: string;
    name: string;
    organizer: string;
    description: string;
    sport: string;
    members: string[];
    games: string[];
    isPublic: boolean;
}