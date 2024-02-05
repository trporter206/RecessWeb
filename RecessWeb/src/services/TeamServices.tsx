import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc } from 'firebase/firestore';
import { Team } from '../models/Team';
import { firebaseConfig, firestore } from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchTeams(): Promise<Team[]> {
    console.log('fetching...teams');
    try {
        const snapshot = await getDocs(collection(db, 'Teams'));
        const teams = snapshot.docs.map((doc) => {
            const data = doc.data();
            const team: Team = {
                id: doc.id,
                name: doc.id,
                members: data.members || [],
                skill: data.skill,
                wins: data.wins,
                losses: data.losses,
                sport: data.sport,
                availableLocations: data.availableLocations,
                availableTimes: data.availableTimes,
                lookingForPlayers: data.lookingForPlayers,
                joinInstructions: data.joinInstructions
            };
            return team;
        });
        return teams;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
}

export const fetchTeamDetails = async (teamName: string): Promise<Team> => {
    console.log('fetching...team details');
    try {
        const teamRef = doc(firestore, 'Teams', teamName);
        const teamSnapshot = await getDoc(teamRef);

        if (!teamSnapshot.exists()) {
            throw new Error('Team not found');
        }

        const teamData = teamSnapshot.data();
        return {
            name: teamSnapshot.id,
            ...teamData
        } as Team;
    } catch (error) {
        console.error('Error fetching team details:', error);
        throw error;
    }
}

export async function createTeam(team: Omit<Team, 'id'>): Promise<string> {
    console.log('creating...team');
    try {
        const teamRef = await addDoc(collection(db, 'Teams'), team);
        const firestoreId = teamRef.id;
        await updateDoc(teamRef, { id: firestoreId });
        return firestoreId
    } catch (error) {
        console.error('Error creating team:', error);
        throw error;
    }
}

export async function deleteTeam(teamId: string): Promise<void> {
    console.log('deleting...team');
    try {
        const teamRef = doc(db, 'Teams', teamId);
        const teamSnapshot = await getDoc(teamRef);
        if (!teamSnapshot.exists()) {
            console.error('Team does not exist');
            throw new Error('Team not found');
        }
        deleteDoc(teamRef);
    } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
    }
}

export async function removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    console.log('removing...member from team');
    try {
        const teamRef = doc(db, 'Teams', teamId);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
            throw new Error(`Team with ID ${teamId} not found.`);
        }

        const teamData = teamSnap.data();
        // Check if userId is in the team's members array
        if (teamData.members.includes(userId)) {
            await updateDoc(teamRef, {
                members: arrayRemove(userId)
            });
            console.log(`User ${userId} removed from team ${teamId}.`);
        } else {
            // User is not a member of the team, handle accordingly
            console.log(`User ${userId} is not a member of team ${teamId}, skipping removal.`);
        }
    } catch (error) {
        console.error('Error removing member from team:', error);
        throw error;
    }
}


export async function addMemberToTeam(teamId: string, userId: string): Promise<void> {
    console.log('adding...member to team');
    try {
        const teamRef = doc(db, 'Teams', teamId);
        const teamSnap = await getDoc(teamRef);

        if (!teamSnap.exists()) {
            throw new Error(`Team with ID ${teamId} not found.`);
        }

        const teamData = teamSnap.data();
        // Check if userId is already a member of the team's members array
        if (!teamData.members.includes(userId)) {
            await updateDoc(teamRef, {
                members: arrayUnion(userId)
            });
            console.log(`User ${userId} added to team ${teamId}.`);
        } else {
            // User is already a member of the team, handle accordingly
            console.log(`User ${userId} is already a member of team ${teamId}, skipping addition.`);
        }
    } catch (error) {
        console.error('Error adding member to team:', error);
        throw error;
    }
}

    