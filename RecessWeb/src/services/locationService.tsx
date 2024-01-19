import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Location } from '../models/Location';
import { firebaseConfig } from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchLocations(): Promise<Location[]> {
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
        return Promise.all(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}
async function fetchGames(locationId: string): Promise<string[]> {
    try {
        const gamesSnapshot = await getDocs(query(collection(db, 'Games'), where('locationId', '==', locationId)));
        const games = gamesSnapshot.docs.map((doc) => doc.id);
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export default fetchLocations;

