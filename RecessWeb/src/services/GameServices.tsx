import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Game } from '../models/Game';
import { firebaseConfig, firestore } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export async function fetchGames(): Promise<Game[]> {
    try {
        console.log('Fetching games');
        const snapshot = await getDocs(collection(db, 'Games'));
        const games = snapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: data.players || [],
                time: data.time.toDate(),
                hostId: data.hostId,
                minimumPoints: data.minimumPoints,
                description: data.description,
            };
            return game;
        });
        console.log('fetched games: ', games.length);
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export const fetchGameDetails = async (gameId: string): Promise<Game> => {
    try {
        const gameRef = doc(firestore, 'Games', gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (!gameSnapshot.exists()) {
            throw new Error('Game not found');
        }

        const gameData = gameSnapshot.data();
        return {
            id: gameSnapshot.id,
            ...gameData
        } as Game;
    } catch (error) {
        console.error('Error fetching game details:', error);
        throw error;
    }
};

export async function deleteGame(gameId: string, removeGameCallback: (gameId: string) => void, updatePoints: (pointsToAdd: number) => void): Promise<void> {
    try {
        const gameRef = doc(db, 'Games', gameId);
        const gameSnapshot = await getDoc(gameRef);

        if (!gameSnapshot.exists()) {
            console.error('Game does not exist');
            throw new Error('Game not found');
        }

        const gameData = gameSnapshot.data();

        // Delete game from Firebase
        const locationRef = doc(db, 'Locations', gameData.locationId);
        await Promise.all([
            deleteDoc(gameRef),
            updateDoc(locationRef, { games: arrayRemove(gameId) })
        ]);

        // Update the DataContext and points
        removeGameCallback(gameId);
        updatePoints(-10);

    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
}



export async function createGame(gameData: Omit<Game, 'id'>, updateTotalGames: (increment: boolean) => void): Promise<string> {
    try {
      const gameRef = await addDoc(collection(db, 'Games'), gameData);
      const firestoreId = gameRef.id;
      await updateDoc(gameRef, { id: firestoreId });
      const locationRef = doc(db, 'Locations', gameData.locationId);
      await updateDoc(locationRef, { games: arrayUnion(firestoreId) });
  
      updateTotalGames(true);  // Update the total games count
      const locationSnapshot = await getDoc(locationRef);
      if (locationSnapshot.exists()) {
          const locationData = locationSnapshot.data();
          const newTotalGames = (locationData.totalGames || 0) + 1;
          await updateDoc(locationRef, { totalGames: newTotalGames });
      }
      return firestoreId;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }
  

type UpdateGameCallback = (gameId: string, userId: string, isJoining: boolean) => void;

export const joinGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback, updatePoints: (pointsToAdd: number) => void) => {
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayUnion(userId)
      });
      updateGameCallback(gameId, userId, true);
      updatePoints(5);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  };
  
export const leaveGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback, updatePoints: (pointsToAdd: number) => void) => {
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayRemove(userId)
      });
      updateGameCallback(gameId, userId, false);
  
      // Update user's points by -5 when leaving a game
      updatePoints(-5);
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  };
  
