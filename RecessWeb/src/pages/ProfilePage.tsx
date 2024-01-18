// src/components/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/LoginForm';
import { User } from 'firebase/auth';
import { ProfileCreationModal } from '../components/ProfileCreationModal';

export const ProfilePage = () => {
        const [user, setUser] = useState<User | null>(null);
        const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);

        useEffect(() => {
                const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
                    setUser(currentUser);
                });
        
                return unsubscribe; // Unsubscribe on unmount
            }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            // Handle successful logout
        } catch (error) {
            // Handle logout errors
            console.error("Logout error:", error);
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            ) : (
                <LoginForm />
            )}
            {user && (
                <ProfileCreationModal 
                    show={showProfileCreationModal} 
                    onClose={() => setShowProfileCreationModal(false)} 
                />
            )}
        </div>
    );
};
