import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
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
                totalGames: data.totalGames,
                id: data.id,
                password: ''
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

export async function fetchUsernameById(userId: string): Promise<string> {
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('fetched username: ', userData.username);
            return userData.username; // Assuming 'username' is the field name in your user document
        } else {
            console.error(`No user found with ID ${userId}`);
            return ''; // Return empty string or handle as needed
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
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


