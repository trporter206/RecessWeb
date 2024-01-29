import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Game } from '../models/Game';
import { firebaseConfig, firestore } from '../firebaseConfig';
import { updateGamesHostedForLoggedInUser, updatePointsForLoggedInUser } from './UserServices';
import { updateTotalGamesForLocation } from './locationService';

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

export async function deleteGame(gameId: string, removeGameCallback: (gameId: string) => void): Promise<void> {
    try {
      //find game reference
        const gameRef = doc(db, 'Games', gameId);
        const gameSnapshot = await getDoc(gameRef);
        if (!gameSnapshot.exists()) {
            console.error('Game does not exist');
            throw new Error('Game not found');
        }
        // Delete game object and remove from location
        const gameData = gameSnapshot.data();
        const locationRef = doc(db, 'Locations', gameData.locationId);
        await Promise.all([
            deleteDoc(gameRef),
            updateDoc(locationRef, { games: arrayRemove(gameId) })
        ]);
        await updateTotalGamesForLocation(gameData.locationId, false);
        // Update user
        removeGameCallback(gameId);
        await updatePointsForLoggedInUser(-10);
        await updateGamesHostedForLoggedInUser(false);

    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
}



export async function createGame(gameData: Omit<Game, 'id'>): Promise<string> {
    try {
      //create game  in firebase
      const gameRef = await addDoc(collection(db, 'Games'), gameData);
      const firestoreId = gameRef.id;
      await updateDoc(gameRef, { id: firestoreId });
      //add game to location
      const locationRef = doc(db, 'Locations', gameData.locationId);
      await updateDoc(locationRef, { games: arrayUnion(firestoreId) });
      await updateTotalGamesForLocation(gameData.locationId, true);
      return firestoreId;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }
  

type UpdateGameCallback = (gameId: string, userId: string, isJoining: boolean) => void;

export const joinGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback) => {
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayUnion(userId)
      });
      updateGameCallback(gameId, userId, true);
      await updatePointsForLoggedInUser(5);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  };
  
export const leaveGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback) => {
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayRemove(userId)
      });
      updateGameCallback(gameId, userId, false);
  
      // Update user's points by -5 when leaving a game
      await updatePointsForLoggedInUser(-5);
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  };
  
