import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Game, GameComment } from '../models/Game';
import { firebaseConfig, firestore } from '../firebaseConfig';
import { addUserToNetwork, updateGamesHostedForLoggedInUser, updatePointsForLoggedInUser } from './UserServices';
import { updateTotalGamesForLocation } from './locationService';
import { updatePointsForUser } from './UserServices';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export async function fetchGames(): Promise<Game[]> {
  console.log('fetching...games');
    try {
        const snapshot = await getDocs(collection(db, 'Games'));
        const games = snapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: data.players || [],
                teams: data.teams || [],
                date:data.time?.toDate() || new Date(),
                startTime: data.startTime,
                endTime: data.endTime,
                skillMinimum: data.skillMinimum,
                skillMaximum: data.skillMaximum,
                maxPlayers: data.maxPlayers,
                title: data.title,
                hostId: data.hostId,
                minimumPoints: data.minimumPoints,
                description: data.description,
                pending: data.pending,
                isTeamGame: data.isTeamGame,
                comments: data.comments || [],
            };
            return game;
        });
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export const fetchGameDetails = async (gameId: string): Promise<Game> => {
  console.log('fetching...game details');
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

export const updateGame = async (gameId: string, gameData: Partial<Game>): Promise<void> => {
  console.log('fetching...game update');
    try {
        const gameRef = doc(firestore, 'Games', gameId);
        await updateDoc(gameRef, gameData);
    } catch (error) {
        console.error('Error updating game:', error);
        throw error;
    }
}

export const addCommentToGame = async (gameId: string, gameComment: GameComment): Promise<void> => {
  console.log('Adding comment to game...');
  try {
    const gameRef = doc(firestore, 'Games', gameId);

    await updateDoc(gameRef, {
      comments: arrayUnion(gameComment) // Add the comment with its ID
    });
    
    console.log('Comment added successfully.');
  } catch (error) {
    console.error('Error adding comment to game:', error);
    throw error;
  }
};


export const removeCommentFromGame = async (gameId: string, commentId: string): Promise<void> => {
  console.log('Removing comment from game...');
  try {
    const gameRef = doc(firestore, 'Games', gameId);
    const gameSnapshot = await getDoc(gameRef);
    if (!gameSnapshot.exists()) {
      throw new Error('Game not found');
    }
    const gameData = gameSnapshot.data() as { comments: GameComment[] }; 
    const updatedComments = gameData.comments.filter(comment => comment.id !== commentId);

    await updateDoc(gameRef, {
      comments: updatedComments // Update with the filtered comments array
    });

    console.log('Comment removed successfully.');
  } catch (error) {
    console.error('Error removing comment from game:', error);
    throw error;
  }
};


export const addTeamToGame = async (gameId: string, teamId: string): Promise<void> => {
  console.log('fetching...team addition');
    try {
        const gameRef = doc(firestore, 'Games', gameId);
        await updateDoc(gameRef, {
            teams: arrayUnion(teamId)
        });
    } catch (error) {
        console.error('Error adding team to game:', error);
        throw error;
    }
}

export const removeTeamFromGame = async (gameId: string, teamId: string): Promise<void> => {
  console.log('fetching...team removal');
    try {
        const gameRef = doc(firestore, 'Games', gameId);
        await updateDoc(gameRef, {
            teams: arrayRemove(teamId)
        });
    } catch (error) {
        console.error('Error removing team from game:', error);
        throw error;
    }
}

export async function deleteGame(gameId: string, removeGameCallback: (gameId: string) => void): Promise<void> {
  console.log('fetching...game deletion');
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
  console.log('fetching...game creation');
    try {
      //create game  in firebase
      const gameRef = await addDoc(collection(db, 'Games'), gameData);
      const firestoreId = gameRef.id;
      await updateDoc(gameRef, { id: firestoreId });
      return firestoreId;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
}

export async function rewardBonusPoints(gameId: string): Promise<void> {
  console.log('fetching...bonus points');
  try {
      const gameRef = doc(db, 'Games', gameId);
      const gameSnapshot = await getDoc(gameRef);
      if (!gameSnapshot.exists()) {
          throw new Error('Game not found');
      }

      const gameData = gameSnapshot.data();
      const totalPlayers = gameData.players.length + 1; // Including the host
      const bonusPoints = totalPlayers * 2;

      // Update points for the host
      await updatePointsForUser(gameData.hostId, bonusPoints);

      // Update points for each player
      for (const playerId of gameData.players) {
          await updatePointsForUser(playerId, bonusPoints);
      }
  } catch (error) {
      console.error('Error rewarding bonus points:', error);
      throw error;
  }
}

export async function completeGame(gameId: string): Promise<void> {
  console.log('fetching...game completion');
  try {
      const gameRef = doc(db, 'Games', gameId);
      const gameSnapshot = await getDoc(gameRef);
      if (!gameSnapshot.exists()) {
          console.error('Game does not exist');
          throw new Error('Game not found');
      }
      const gameData = gameSnapshot.data();
      
      // Update player networks
      const hostId = gameData.hostId;
      const playerIds = gameData.players;

      for (const playerId of playerIds) {
          if (playerId !== hostId) {
            await addUserToNetwork(playerId, hostId);
            await addUserToNetwork(hostId, playerId);
          }
      }

      // Delete game object
      const locationRef = doc(db, 'Locations', gameData.locationId);
      await Promise.all([
        deleteDoc(gameRef),
        updateDoc(locationRef, { games: arrayRemove(gameId) })
      ]);
      // Additional user update logic here if needed
  } catch (error) {
      console.error('Error completing game:', error);
      throw error;
  }
}

type UpdateGameCallback = (gameId: string, userId: string, isJoining: boolean) => void;

export const joinGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback) => {
  console.log('fetching...joining game');
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayUnion(userId)
      });
      updateGameCallback(gameId, userId, true);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
};
  
export const leaveGame = async (gameId: string, userId: string, updateGameCallback: UpdateGameCallback) => {
  console.log('fetching...leaving game');
    try {
      const gameRef = doc(firestore, 'Games', gameId);
      await updateDoc(gameRef, {
        players: arrayRemove(userId)
      });
      updateGameCallback(gameId, userId, false);
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
};

export async function toggleGamePendingStatus(gameId: string): Promise<void> {
  console.log('Toggling game pending status...');

  const gameRef = doc(db, 'Games', gameId);

  try {
    const gameSnapshot = await getDoc(gameRef);
    
    if (!gameSnapshot.exists()) {
      throw new Error('Game not found');
    }

    const gameData = gameSnapshot.data();
    const currentPendingStatus = gameData.pending;

    // Toggle the 'pending' status
    await updateDoc(gameRef, {
      pending: !currentPendingStatus
    });

    console.log(`Game pending status toggled to ${!currentPendingStatus}.`);
  } catch (error) {
    console.error('Error toggling game pending status:', error);
    throw error;
  }
}

  
