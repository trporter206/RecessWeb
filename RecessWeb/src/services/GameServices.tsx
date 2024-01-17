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
        const snapshot = await getDocs(collection(db, 'Locations'));
        const games = snapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: [],
                time: data.time.toDate()
            };
            return game;
        });
        return games;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

async function createGame(gameData: Game): Promise<void> {
    try {
        await addDoc(collection(db, 'Games'), gameData);
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
}

export default fetchGames;
