import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Location } from '../models/Location';
import { Game } from '../models/Game';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

async function fetchLocations(): Promise<Location[]> {
    try {
        const snapshot = await getDocs(collection(db, 'Locations'));
        const locations = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const location: Location = {
                id: doc.id,
                name: data.name,
                description: data.description,
                games: await fetchGames(doc.id)
            };
            console.log(location.id);
            return location;
        });
        return Promise.all(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

async function fetchGames(locationId: string): Promise<Game[]> {
    try {
        const gamesSnapshot = await getDocs(query(collection(db, 'Games'), where('locationId', '==', locationId)));
        const games = gamesSnapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: data.players,
                time: data.time.toDate(),
                // Add other properties as needed
            };
            return game;
        });
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export default fetchLocations;

export const generateRandomLocation = () => {
    console.log('Generating random location');
    const randomId = Math.random().toString(36).substring(2, 9); // Generate a random string
    const randomName = `Location ${randomId.toUpperCase()}`;
    const randomDescription = `Description for ${randomName}`;
  
    return {
      id: randomId,
      name: randomName,
      description: randomDescription,
      games: [] // Keeping games empty
    };
  };
