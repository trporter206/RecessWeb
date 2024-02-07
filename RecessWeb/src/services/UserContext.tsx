import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { User } from 'firebase/auth'; // Import User type
import { doc, onSnapshot } from 'firebase/firestore';

// Define UserProfile type
interface UserProfile {
  username: string;
  email: string;
  points: number;
  rating: number;
  id: string;
  network: string[];
  gamesHosted: number;
  gamesJoined: number;
  ratings: Record<string, number>;
  favoriteLocations: string[];
  pendingInvites: string[];
  teams: string[];
  pendingTeamInvites: string[];
  // Add other fields as necessary
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
}

// Create a context
export const UserContext = createContext<UserContextType>({
    user: null,
    profile: null,
  });
  

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Auth state listener
        const unsubscribeAuth = auth.onAuthStateChanged(user => setUser(user));

        // Firestore user data listener
        let unsubscribeUser: () => void = () => {};
        if (user) {
            const userRef = doc(firestore, 'Users', user.uid);
            unsubscribeUser = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    setProfile(doc.data() as UserProfile);
                } else {
                    setProfile(null);
                }
            });
        } else {
            setProfile(null);
        }

        return () => {
            unsubscribeAuth();
            unsubscribeUser();
        };
    }, [user]);

    return (
        <UserContext.Provider value={{ user, profile }}>
            {children}
        </UserContext.Provider>
    );
};
