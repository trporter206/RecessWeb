import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { Game } from '../models/Game';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

async function fetchGames(): Promise<Game[]> {
    try {
        console.log('Fetching games');
        const snapshot = await getDocs(collection(db, 'Games')); // Changed to 'Games'
        const games = snapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: data.players || [], // Assuming 'players' field exists
                time: data.time.toDate() // Make sure 'time' field exists and is a Timestamp
            };
            return game;
        });
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}


export async function createGame(gameData: Game): Promise<void> {
    try {
        await addDoc(collection(db, 'Games'), gameData);
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}

export default fetchGames;

export const generateRandomGame = () => {
    console.log('Generating random game');
    const randomId = Math.random().toString(36).substring(2, 9); // Generate a random string
    const randomLocationId = `Location ${randomId.toUpperCase()}`;
  
    return {
      id: randomId,
      randomLocationId: randomLocationId,
      players: [],
      time: new Date(),
    };
  };

