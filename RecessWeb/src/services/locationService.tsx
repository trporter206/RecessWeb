import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Location } from '../models/Location';
import { Game } from '../models/Game';
import { firebaseConfig } from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchLocations(): Promise<Location[]> {
    try {
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
            console.log(location.id);
            return location;
        });
        return Promise.all(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

async function fetchGames(locationId: string): Promise<Game[]> {
    try {
        const gamesSnapshot = await getDocs(query(collection(db, 'Games'), where('locationId', '==', locationId)));
        const games = gamesSnapshot.docs.map((doc) => {
            const data = doc.data();
            const game: Game = {
                id: doc.id,
                locationId: data.locationId,
                players: data.players,
                time: data.time.toDate(),
            };
            return game;
        });
        return games;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export default fetchLocations;

export const generateRandomLocation = () => {
    console.log('Generating random location');
    const randomId = Math.random().toString(36).substring(2, 9);
    const randomName = `Location ${randomId.toUpperCase()}`;
    const randomDescription = `Description for ${randomName}`;
    const randomLatitude = Math.random() * 180 - 90;
    const randomLongitude = Math.random() * 360 - 180;
  
    return {
      id: randomId,
      name: randomName,
      description: randomDescription,
      games: [],
      coordinates: { latitude: randomLatitude, longitude: randomLongitude },
    };
  };
