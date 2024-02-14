import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { User } from '../models/User';
import { firebaseConfig, firestore } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchUsers(): Promise<User[]> {
  console.log('fetching...users');
    try {
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
                favoriteLocations: data.favoriteLocations,
                pendingInvites: data.pendingInvites,
                firstName: data.firstName,
                lastName: data.lastName,
                pickleballSkill: data.pickleballSkill,
                age: data.age,
                gender: data.gender,
                teams: data.teams,
                pendingTeamInvites: data.pendingTeamInvites
            };
            return user;
        });
        return Promise.all(users);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

export async function updateUser(userId: string, user: User): Promise<void> {
  console.log('updating...user');
  try {
    const userRef = doc(db, 'Users', userId);
    await setDoc(userRef, user);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function acceptTeamInvite(teamId: string, userId: string) {
  // Add user to the team's members
  const teamRef = doc(db, 'Teams', teamId);
  await updateDoc(teamRef, {
    members: arrayUnion(userId)
  });

  // Remove invitation from user's pendingTeamInvites
  const userRef = doc(db, 'Users', userId);
  await updateDoc(userRef, {
    pendingTeamInvites: arrayRemove(teamId)
  });
}

export async function declineTeamInvite(teamId: string, userId: string) {
  const userRef = doc(db, 'Users', userId);
  await updateDoc(userRef, {
    pendingTeamInvites: arrayRemove(teamId)
  });
}

export async function sendTeamInvite(teamId: string, userId: string) {
  const userRef = doc(db, "Users", userId);
  try {
    await updateDoc(userRef, {
      pendingTeamInvites: arrayUnion(teamId)
    });
    console.log("Team invite sent successfully.");
  } catch (error) {
    console.error("Error sending team invite: ", error);
  }
}

export async function addTeamToUser(userId: string, teamId: string): Promise<void> {
  console.log('fetching...add team to user');
  const userRef = doc(db, 'Users', userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      teams: arrayUnion(teamId)
    });
  } catch (error) {
    console.error('Error adding team to user:', error);
    throw error;
  }

}

export async function removeTeamFromUser(userId: string, teamId: string): Promise<void> {
  console.log('fetching...remove team from user');
  const userRef = doc(db, 'Users', userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      teams: arrayRemove(teamId)
    });
  } catch (error) {
    console.error('Error removing team from user:', error);
    throw error;
  }
}

export async function isUserOnTeamOfType(teamType: string): Promise<boolean> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No user logged in');
    return false;
  }

  const userRef = doc(db, 'Users', currentUser.uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error('User not found');
      return false;
    }
    const userData = userSnap.data();
    const userTeamIds = userData.teams || [];
    return await checkTeamsForType(userTeamIds, teamType);
  } catch (error) {
    console.error('Error checking user teams:', error);
    return false;
  }
}

async function checkTeamsForType(teamIds: string[], teamType: string): Promise<boolean> {
  for (const teamId of teamIds) {
    const teamRef = doc(db, 'Teams', teamId);
    const teamSnap = await getDoc(teamRef);

    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      if (teamData.type === teamType) {
        return true;
      }
    }
  }
  return false;
}

export async function removeGameFromPendingInvites(userId: string, gameId: string): Promise<void> {
  console.log('Removing game from pending invites...');
  const userRef = doc(db, 'Users', userId);

  try {
    // Get the current user data to check if the user exists
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    // Remove the specified game from the user's pendingInvites
    await updateDoc(userRef, {
      pendingInvites: arrayRemove(gameId)
    });

    console.log('Game removed from pending invites successfully');
  } catch (error) {
    console.error('Error removing game from pending invites:', error);
    throw error;
  }
}

// Add a game to the user's pendingInvites
export async function addGameToPendingInvites(userId: string, gameId: string): Promise<void> {
  console.log('Adding game to pending invites...');
  const userRef = doc(db, 'Users', userId);

  try {
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      pendingInvites: arrayUnion(gameId)
    });

    console.log('Game added to pending invites successfully');
  } catch (error) {
    console.error('Error adding game to pending invites:', error);
    throw error;
  }
}


export async function fetchUsernameById(userIds: string | string[]): Promise<string[]> {
  console.log('fetching...user ID');
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

    return usernames;
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    throw error;
  }
}

export async function updateRatingsForUser(targetUserId: string, rating: 1 | 0): Promise<void> {
  console.log('fetching...user ratings');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('No user logged in');
  }

  const loggedInUserId = currentUser.uid; // Get the logged-in user's ID
  const targetUserRef = doc(firestore, 'Users', targetUserId); // Reference to the target user document

  try {
    const targetUserSnapshot = await getDoc(targetUserRef);

    if (!targetUserSnapshot.exists()) {
      throw new Error('Target user not found');
    }

    const targetUserData = targetUserSnapshot.data();
    const currentRating = targetUserData.ratings ? targetUserData.ratings[loggedInUserId] : undefined;

    let updatedRatings = { ...targetUserData.ratings };

    if (currentRating === rating) {
      // If trying to set the same rating, remove the rating entirely
      delete updatedRatings[loggedInUserId];
    } else {
      // If setting a different rating, update or add the new rating
      updatedRatings[loggedInUserId] = rating;
    }

    // Update the target user's ratings
    await updateDoc(targetUserRef, {
      ratings: updatedRatings
    });

  } catch (error) {
    console.error('Error updating user ratings:', error);
    throw error;
  }
}

export async function updatePointsForLoggedInUser(pointsChange: number) {
  console.log('fetching... logged in user points');
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
  console.log('fetching...user points');
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
  console.log('fetching...update for login user games hosted');
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
  console.log('fetching...games joined for login user');
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
  console.log('fetching...favorite locations');
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
  console.log('fetching...remove favorite');
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
  console.log('fetching...user network');
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


