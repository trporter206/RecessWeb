import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
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

export async function deleteGame(gameId: string): Promise<void> {
    try {
        const gameRef = doc(db, 'Games', gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (!gameSnapshot.exists()) {
            console.error('Game does not exist');
            throw new Error('Game not found');
        }

        const gameData = gameSnapshot.data();
        if (gameData === undefined) {
            console.error('Game data is undefined');
            throw new Error('Game data is undefined');
        }

        const locationRef = doc(db, 'Locations', gameData.locationId);
        
        await Promise.all([
            deleteDoc(gameRef),
            updateDoc(locationRef, {
                games: arrayRemove(gameId)
            })
        ]);
    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
}


export async function createGame(gameData: Omit<Game, 'id'>): Promise<string> {
    try {
        const gameRef = await addDoc(collection(db, 'Games'), gameData);
        const firestoreId = gameRef.id;

        await updateDoc(gameRef, { id: firestoreId });

        const locationRef = doc(db, 'Locations', gameData.locationId);
        await updateDoc(locationRef, {
            games: arrayUnion(firestoreId)
        });

        return firestoreId; // Return the new game ID
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
      locationId: randomLocationId,
      players: [],
      time: new Date(),
    };
};

