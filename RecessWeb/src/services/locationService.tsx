import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Location } from '../models/Location';
import { firebaseConfig } from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchLocations(): Promise<Location[]> {
    try {
        console.log('Fetching locations');
        const snapshot = await getDocs(collection(db, 'Locations'));
        const locations = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const location: Location = {
                id: doc.id,
                name: data.name,
                description: data.description,
                games: await fetchGames(doc.id),
                totalGames: data.totalGames,
                coordinates: {latitude: data.coordinates.latitude, longitude: data.coordinates.longitude}
            };
            return location;
        });
        console.log('fetched locations: ', locations.length);
        return Promise.all(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

export async function fetchGames(locationId: string): Promise<string[]> {
    try {
        const gamesSnapshot = await getDocs(query(collection(db, 'Games'), where('locationId', '==', locationId)));
        const gameIds = gamesSnapshot.docs.map(doc => doc.id);
        console.log('fetched game IDs: ', gameIds.length);
        return gameIds;
    } catch (error) {
        console.error('Error fetching game IDs:', error);
        throw error;
    }
}

export function getLocationCoordinates(locationId: string): Promise<{ latitude: number, longitude: number }> {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(collection(db, 'Locations'), locationId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const coordinates = {
                    latitude: data.coordinates.latitude,
                    longitude: data.coordinates.longitude
                };
                resolve(coordinates);
            } else {
                reject(new Error('Location not found'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

export async function updateTotalGamesForLocation(locationId: string, increment: boolean) {
    const locationRef = doc(db, 'Locations', locationId);
  
    try {
      // Get current location data
      const locationSnapshot = await getDoc(locationRef);
      if (!locationSnapshot.exists()) {
        throw new Error('Location not found');
      }
      const locationData = locationSnapshot.data();
  
      // Calculate new totalGames count
      const newTotalGames = (locationData.totalGames || 0) + (increment ? 1 : -1);
  
      // Update totalGames in Firestore
      await updateDoc(locationRef, {
        totalGames: newTotalGames
      });
    } catch (error) {
      console.error('Error updating total games for location:', error);
      throw error;
    }
}