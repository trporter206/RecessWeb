import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { User } from 'firebase/auth'; // Import User type
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Define UserProfile type
interface UserProfile {
  username: string;
  email: string;
  points: number;
  rating: number;
  totalGames: number;
  // Add other fields as necessary
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    updateTotalGames: (increment: boolean) => void;
}

// Create a context
export const UserContext = createContext<UserContextType>({
    user: null,
    profile: null,
    updateTotalGames: async () => {} // Provide a default implementation
  });
  

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid));
                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const updateTotalGames = async (increment: boolean) => {
        if (!user || !profile) return;
      
        const newTotalGames = increment ? profile.totalGames + 1 : profile.totalGames;
        setProfile({ ...profile, totalGames: newTotalGames });
      
        // Update Firestore
        const userRef = doc(firestore, 'Users', user.uid);
        await updateDoc(userRef, { totalGames: newTotalGames });
    };

    return (
        <UserContext.Provider value={{ user, profile, updateTotalGames }}>
            {children}
        </UserContext.Provider>
    );
};
