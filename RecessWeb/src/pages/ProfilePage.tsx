import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/LoginForm';
import { ProfileCreationModal } from '../components/ProfileCreationModal';
import { UserContext } from '../services/UserContext';
import { DataContext } from '../services/DataProvider';
import { GamesList } from '../components/Game Components/GamesList';
import { Game } from '../models/Game'; // Import the Game type
import { Location } from '../models/Location'; // Import the Location type
import { LocationsList } from '../components/Location Components/LocationsList';

export const ProfilePage = () => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);
  const user = userContext?.user;
  const profile = userContext?.profile;
  const games = dataContext?.games || []; 
  const { username, points, gamesHosted, gamesJoined, network } = profile || 
  { username: '', points: 0, totalGames: 0, gamesHosted: 0, gamesJoined: 0, network: [] };

  let userGames: Game[] = [];
  let favoriteLocations: Location[] = [];

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user && user.uid) {
    userGames = games.filter(game => 
      game.hostId === user.uid || game.players.includes(user.uid)
    );
  }

  if (profile) {
    // Ensure favoriteLocations is an array before using it
    const favoriteLocationsIds = profile.favoriteLocations || [];
    favoriteLocations = dataContext.locations.filter(location => 
      favoriteLocationsIds.includes(location.id)
    );
  }

  return (
    <div className='main-container'>
      {user ? (
        <div>
          <p>Welcome, {username}</p>
          <button onClick={handleLogout}>Log Out</button>
          <div>
            <h2>Profile Stats</h2>
            <h3>Points: {points}</h3>
            <h3>Games Hosted: {gamesHosted}</h3>
            <h3>Games Joined: {gamesJoined}</h3>
            <h3>Network size: {network.length}</h3>
          </div>
          <div className='user-lists-container'>
            <div className="user-games-container">
              <h2>Your Current Games</h2>
              <GamesList games={userGames} onDeleteGame={() => {}} />
            </div>
            <div className="user-locations-container">
              <h2>Favorite Locations</h2>
              <LocationsList locations={favoriteLocations} />
            </div>
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
