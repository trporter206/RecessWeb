import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { User } from '../models/User';
import { firebaseConfig } from '../firebaseConfig';

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
                skill: data.skill,
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


