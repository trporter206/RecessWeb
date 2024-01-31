import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { User } from '../models/User';
import { firebaseConfig, firestore } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchUsers(): Promise<User[]> {
    try {
        console.log('Fetching users');
        const snapshot = await getDocs(collection(db, 'Users'));
        const users = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const user: User = {
                email: data.email,
                username: data.username,
                points: data.points,
                rating: data.rating,
                gamesHosted: data.gamesHosted,
                gamesJoined: data.gamesJoined,
                ratings: data.ratings,
                network: data.network,
                id: data.id,
                password: '',
                favoriteLocations: data.favoriteLocations
            };
            return user;
        });
        console.log('fetched users: ', users.length);
        return Promise.all(users);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

export async function fetchUsernameById(userIds: string | string[]): Promise<string[]> {
  try {
    // Ensure userIds is always an array
    const userIdsArray = Array.isArray(userIds) ? userIds : [userIds];

    const userRefs = userIdsArray.map((userId) => doc(db, 'Users', userId));
    const userSnaps = await Promise.all(userRefs.map(getDoc));

    const usernames = userSnaps.map((userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.username; // Assuming 'username' is the field name in your user document
      } else {
        console.error(`No user found with ID ${userSnap.id}`);
        return ''; // Return empty string or handle as needed
      }
    });

    console.log('fetched usernames: ', usernames);
    return usernames;
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    throw error;
  }
}


export async function updatePointsForLoggedInUser(pointsChange: number) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error('No user logged in');
    }
  
    const userRef = doc(firestore, 'Users', user.uid);
  
    try {
      // Get current user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      const userData = userSnapshot.data();
  
      // Calculate new points
      const newPoints = Math.max((userData.points || 0) + pointsChange, 0);
  
      // Update points in Firestore
      await updateDoc(userRef, {
        points: newPoints
      });
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
}

// Function to update points for a specific user
export async function updatePointsForUser(userId: string, pointsChange: number): Promise<void> {
  const userRef = doc(db, 'Users', userId);

  try {
      // Get current user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
          throw new Error('User not found');
      }
      const userData = userSnapshot.data();

      // Calculate new points
      const newPoints = Math.max((userData.points || 0) + pointsChange, 0);

      // Update points in Firestore
      await updateDoc(userRef, {
          points: newPoints
      });
  } catch (error) {
      console.error(`Error updating points for user ${userId}:`, error);
      throw error;
  }
}

export async function updateGamesHostedForLoggedInUser(increment: boolean) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error('No user logged in');
    }
  
    const userRef = doc(db, 'Users', user.uid);
  
    try {
      // Get current user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      const userData = userSnapshot.data();
  
      // Calculate new gamesHosted count
      const newGamesHosted = (userData.gamesHosted || 0) + (increment ? 1 : -1);
  
      // Update gamesHosted in Firestore
      await updateDoc(userRef, {
        gamesHosted: newGamesHosted
      });
    } catch (error) {
      console.error('Error updating games hosted:', error);
      throw error;
    }
}

export async function updateGamesJoinedForLoggedInUser(increment: boolean) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error('No user logged in');
    }
  
    const userRef = doc(db, 'Users', user.uid);
  
    try {
      // Get current user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      const userData = userSnapshot.data();
  
      // Calculate new gamesHosted count
      const newGamesJoined = (userData.gamesJoined || 0) + (increment ? 1 : -1);
  
      // Update gamesHosted in Firestore
      await updateDoc(userRef, {
        gamesJoined: newGamesJoined
      });
    } catch (error) {
      console.error('Error updating games joined:', error);
      throw error;
    }
}

export async function addToFavoriteLocations(locationId: string) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error('No user logged in');
    }
  
    const userRef = doc(db, 'Users', user.uid);
  
    try {
      // Get current user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      // Update favoriteLocations in Firestore
      await updateDoc(userRef, {
        favoriteLocations: arrayUnion(locationId)
      });
    } catch (error) {
      console.error('Error updating favorite locations:', error);
      throw error;
    }
}

export async function removeFromFavoriteLocations(locationId: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user logged in');
  }

  const userRef = doc(db, 'Users', user.uid);

  try {
    // Get current user data
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }
    // Update favoriteLocations in Firestore
    await updateDoc(userRef, {
      favoriteLocations: arrayRemove(locationId)
    });
  } catch (error) {
    console.error('Error updating favorite locations:', error);
    throw error;
  }
}

export async function addUserToNetwork(userId: string, friendId: string) {
  const userRef = doc(db, 'Users', userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnapshot.data();
    const existingNetwork = userData.network || [];

    if (!existingNetwork.includes(friendId)) {
      await updateDoc(userRef, {
        network: arrayUnion(friendId)
      });
    }
  } catch (error) {
    console.error('Error updating network:', error);
    throw error;
  }
}


