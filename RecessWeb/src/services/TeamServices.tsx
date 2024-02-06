import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { Team } from '../models/Team';
import { firebaseConfig } from '../firebaseConfig';

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
                name: data.name,
                members: data.members || [],
                skill: data.skill,
                wins: data.wins,
                losses: data.losses,
                sport: data.sport,
                availableLocations: data.availableLocations,
                availableTimes: data.availableTimes,
                lookingForPlayers: data.lookingForPlayers,
                joinInstructions: data.joinInstructions,
                pendingChallenges: data.pendingChallenges || []
            };
            return team;
        });
        return teams;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
}

export async function verifyTeam(teamId: string): Promise<DocumentData> {
    console.log('Verifying team...');

    const teamRef = doc(db, 'Teams', teamId);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) {
        console.log(`Team ${teamId} does not exist.`);
        throw new Error(`Team with ID ${teamId} not found.`);
    }

    console.log(`Team ${teamId} verified successfully.`);
    return teamSnap.data(); // Return the document snapshot
}

export async function addGameInviteToTeam(teamId: string, gameId: string): Promise<void> {
    console.log('Adding game to team invites...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (!teamData.pendingChallenges.includes(gameId)) {
            await updateDoc(teamRef, {
                pendingChallenges: arrayUnion(gameId)
            });
            console.log(`Game ${gameId} added to team ${teamId}.`);
        } else {
            console.log(`Game ${gameId} is already in team ${teamId}, skipping addition.`);
        }
    } catch (error) {
        console.error('Error adding game to team invites:', error);
        throw error;
    }
}

export async function removeGameInviteFromTeam(teamId: string, gameId: string): Promise<void> {
    console.log('Removing game from team invites...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (teamData.pendingChallenges.includes(gameId)) {
            await updateDoc(teamRef, {
                pendingChallenges: arrayRemove(gameId)
            });
            console.log(`Game ${gameId} removed from team ${teamId}.`);
        } else {
            console.log(`Game ${gameId} is not in team ${teamId}, skipping removal.`);
        }
    } catch (error) {
        console.error('Error removing game from team invites:', error);
        throw error;
    }
}

export const fetchTeamDetails = async (teamId: string): Promise<Team> => {
    console.log('Fetching team details...');
    try {
        const teamData = await verifyTeam(teamId); 
        console.log(`Fetched details for team ${teamId}.`);
        return {
            id: teamId,
            ...teamData
        } as Team; 
    } catch (error) {
        console.error('Error fetching team details:', error);
        throw new Error(`Error fetching team details: ${error instanceof Error ? error.message : error}`);
    }
};

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
    console.log('Deleting team...');
    try {
        await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        await deleteDoc(teamRef);
        console.log(`Team ${teamId} successfully deleted.`);
    } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
    }
}

export async function removeMemberFromTeam(teamId: string, userId: string): Promise<void> {
    console.log('Removing member from team...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (teamData.members && teamData.members.includes(userId)) {
            await updateDoc(teamRef, {
                members: arrayRemove(userId)
            });
            console.log(`User ${userId} removed from team ${teamId}.`);
        } else {
            console.log(`User ${userId} is not a member of team ${teamId}, skipping removal.`);
        }
    } catch (error) {
        console.error('Error removing member from team:', error);
        throw error;
    }
}

export async function addMemberToTeam(teamId: string, userId: string): Promise<void> {
    console.log('Adding member to team...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (teamData.members && !teamData.members.includes(userId)) {
            await updateDoc(teamRef, {
                members: arrayUnion(userId)
            });
            console.log(`User ${userId} added to team ${teamId}.`);
        } else {
            console.log(`User ${userId} is already a member of team ${teamId}, skipping addition.`);
        }
    } catch (error) {
        console.error('Error adding member to team:', error);
        throw error;
    }
}

export async function addWin(teamId: string): Promise<void> {
    console.log('Adding win...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        const newWins = (teamData.wins || 0) + 1;
        await updateDoc(teamRef, {
            wins: newWins
        });
        console.log(`Win added to team ${teamId}.`);
    } catch (error) {
        console.error('Error adding win:', error);
        throw error;
    }
}

export async function addLoss(teamId: string): Promise<void> {
    console.log('Adding loss...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        const newLosses = (teamData.losses || 0) + 1;
        await updateDoc(teamRef, {
            losses: newLosses
        });
        console.log(`Loss added to team ${teamId}.`);
    } catch (error) {
        console.error('Error adding loss:', error);
        throw error;
    }
}

export async function addAvailableLocationToTeam(teamId: string, locationId: string): Promise<void> {
    console.log('Adding available location to team...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (!teamData.availableLocations.includes(locationId)) {
            await updateDoc(teamRef, {
                availableLocations: arrayUnion(locationId)
            });
            console.log(`Location ${locationId} added to team ${teamId}.`);
        } else {
            console.log(`Location ${locationId} is already in team ${teamId}, skipping addition.`);
        }
    } catch (error) {
        console.error('Error adding available location to team:', error);
        throw error;
    }
}

export async function removeAvailableLocationFromTeam(teamId: string, locationId: string): Promise<void> {
    console.log('Removing available location from team...');
    try {
        const teamData = await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        if (teamData.availableLocations.includes(locationId)) {
            await updateDoc(teamRef, {
                availableLocations: arrayRemove(locationId)
            });
            console.log(`Location ${locationId} removed from team ${teamId}.`);
        } else {
            console.log(`Location ${locationId} is not in team ${teamId}, skipping removal.`);
        }
    } catch (error) {
        console.error('Error removing available location from team:', error);
        throw error;
    }
}

interface AvailableTime {
    day: string;
    startHour: string;
    endHour: string;
}
  
export async function addAvailableTimeToTeam(teamId: string, availableTime: AvailableTime): Promise<void> {
    console.log('Adding available time to team...');
    try {
        await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        await updateDoc(teamRef, {
            availableTimes: arrayUnion(availableTime)
        });
        console.log(`Available time added to team ${teamId}.`);
    } catch (error) {
        console.error('Error adding available time to team:', error);
        throw error;
    }
}

export async function removeAvailableTimeFromTeam(teamId: string, availableTime: AvailableTime): Promise<void> {
    console.log('Removing available time from team...');
    try {
        await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        await updateDoc(teamRef, {
            availableTimes: arrayRemove(availableTime)
        });
        console.log(`Available time removed from team ${teamId}.`);
    } catch (error) {
        console.error('Error removing available time from team:', error);
        throw error;
    }
}

export async function setLookingForPlayers(teamId: string, looking: boolean): Promise<void> {
    console.log('Setting looking for players...');
    try {
        await verifyTeam(teamId);
        const teamRef = doc(db, 'Teams', teamId);
        await updateDoc(teamRef, {
            lookingForPlayers: looking
        });
        console.log(`Looking for players set to ${looking} for team ${teamId}.`);
    } catch (error) {
        console.error('Error setting looking for players:', error);
        throw error;
    }
}