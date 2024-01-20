import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
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
        const games = gamesSnapshot.docs.map((doc) => doc.id);
        console.log('fetched games: ', games.length);
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
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