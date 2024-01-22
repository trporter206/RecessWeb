import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/LoginForm';
import { ProfileCreationModal } from '../components/ProfileCreationModal';
import { UserContext } from '../services/UserContext';
import { DataContext } from '../services/DataProvider';
import { GamesList } from '../components/Game Components/GamesList';
import { Game } from '../models/Game'; // Import the Game type

export const ProfilePage = () => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const user = userContext?.user;
  const profile = userContext?.profile;
  const games = dataContext?.games || []; 

  const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  let userGames: Game[] = []; // Explicitly type userGames as an array of Game objects

  if (user && user.uid) {
    userGames = games.filter(game => 
      game.hostId === user.uid || game.players.includes(user.uid)
    );
  }

  return (
    <div className='main-container'>
      {user ? (
        <div>
          <p>Welcome, {profile?.username}</p>
          <button onClick={handleLogout}>Log Out</button>
          <div className="user-games-container">
            <h2>Your Games</h2>
            <GamesList games={userGames} onDeleteGame={() => {}} />
          </div>
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
