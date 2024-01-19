import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { User } from 'firebase/auth'; // Import User type
import { doc, getDoc } from 'firebase/firestore';

// Define UserProfile type
interface UserProfile {
  username: string;
  email: string;
  skill: number;
  // Add other fields as necessary
}

// Create a context
export const UserContext = createContext<{ user: User | null, profile: UserProfile | null } | null>(null);

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

    return (
        <UserContext.Provider value={{ user, profile }}>
            {children}
        </UserContext.Provider>
    );
};
