import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/LoginForm';
import { ProfileCreationModal } from '../components/ProfileCreationModal';
import { UserContext } from '../services/UserContext'; // Adjust the import path as necessary

export const ProfilePage = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const profile = userContext?.profile;
  const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className='main-container'>
      {user ? (
        <div>
          <p>Welcome, {profile?.username}</p>
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
