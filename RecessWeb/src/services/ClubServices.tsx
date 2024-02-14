import { initializeApp } from "firebase/app";
import { Club } from "../models/Club";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { firebaseConfig, firestore } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchClubs(): Promise<Club[]> {
    console.log('fetching...clubs');
      try {
          const snapshot = await getDocs(collection(db, 'Clubs'));
          const clubs = snapshot.docs.map((doc) => {
              const data = doc.data();
              const club: Club = {
                    id: doc.id,
                    name: data.name,
                    organizer: data.organizer,
                    description: data.description,
                    sport: data.sport,
                    members: data.members || [],
                    games: data.games || [],
                    isPublic: data.isPublic,
              };
              return club;
          });
          return clubs;
      } catch (error) {
          console.error('Error fetching clubs:', error);
          throw error;
      }
  }

export async function fetchClubDetails(clubId: string): Promise<Club> {
    console.log('fetching...club details');
        try {
            const clubRef = doc(firestore, 'Clubs', clubId);
            const clubSnapshot = await getDoc(clubRef);
    
            if (!clubSnapshot.exists) {
                throw new Error('Club not found');
            }
    
            const clubData = clubSnapshot.data();
            return {
                id: clubSnapshot.id,
                ...clubData
            } as Club;
        } catch (error) {
            console.error('Error fetching club details:', error);
            throw error;
        }
}

export async function updateClub(clubId: string, club: Club): Promise<void> {
    console.log('updating...club');
    try {
      const clubRef = doc(db, 'Clubs', clubId);
      await setDoc(clubRef, club);
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    }
}

export const createClub = async (club: Club): Promise<string> => {
        console.log('creating...club');
        try {
          const clubRef = doc(db, 'Clubs', club.id);
          await setDoc(clubRef, club);
          return clubRef.id;
        } catch (error) {
          console.error('Error creating club:', error);
          throw error;
        }
};

export async function deleteClub(clubId: string): Promise<void> {
  console.log('deleting...club');
  try {
    await deleteDoc(doc(db, 'Clubs', clubId));
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
}

export async function addMemberToClub(clubId: string, userId: string): Promise<void> {
  console.log('adding...member to club');
  try {
    const clubRef = await doc(db, 'Clubs', clubId);
    await updateDoc(clubRef, {
        members: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error adding member to club:', error);
    throw error;
  }
}

export async function removeMemberFromClub(clubId: string, userId: string): Promise<void> {
  console.log('removing...member from club');
  try {
    const clubRef = doc(db, 'Clubs', clubId);
    await updateDoc(clubRef, {
        members: arrayRemove(userId)
    });
  } catch (error) {
    console.error('Error removing member from club:', error);
    throw error;
  }
}

export async function addGameToClub(clubId: string, gameId: string): Promise<void> {
  console.log('adding...game to club');
  try {
    const clubRef = await doc(db, 'Clubs', clubId);
    await updateDoc(clubRef, {
        games: arrayUnion(gameId)
    });
  } catch (error) {
    console.error('Error adding game to club:', error);
    throw error;
  }
}

export async function removeGameFromClub(clubId: string, gameId: string): Promise<void> {
  console.log('removing...game from club');
  try {
    const clubRef = await doc(db, 'Clubs', clubId);
    await updateDoc(clubRef, {
        games: arrayRemove(gameId)
    });
  } catch (error) {
    console.error('Error removing game from club:', error);
    throw error;
  }
}