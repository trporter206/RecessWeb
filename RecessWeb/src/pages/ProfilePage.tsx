import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/User Components/LoginForm';
import { ProfileCreationModal } from '../components/User Components/ProfileCreationModal';
import { UserContext } from '../services/UserContext';
import { DataContext } from '../services/DataProvider';
import { GamesList } from '../components/Game Components/GamesList';
import { Game } from '../models/Game'; // Import the Game type
import { Location } from '../models/Location'; // Import the Location type
import { LocationsList } from '../components/Location Components/LocationsList';
import { addGameToUser, removeGameFromPendingInvites } from '../services/UserServices';
import { ClubCreationModal } from '../components/Club Components/ClubCreationModal';
import { GameInviteItem } from '../components/Game Components/GameInviteItem';
import { joinGame } from '../services/GameServices';
import { ClubItem } from '../components/Club Components/ClubItem';
import { Club } from '../models/Club';

export const ProfilePage = () => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);
  const [showClubCreationModal, setShowClubCreationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const user = userContext?.user;
  const profile = userContext?.profile;
  const games = dataContext?.games || []; 
  const { username, points, gamesHosted, gamesJoined, network, currentGames } = profile || 
  { username: '', points: 0, totalGames: 0, gamesHosted: 0, gamesJoined: 0, network: [], clubs: [] };

  let userGames: Game[] = [];
  let favoriteLocations: Location[] = [];
  let pendingInvites: Game[] = [];
  let userClubs: Club[] = [];

  const handleToggleEditModal = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setShowEditModal(prevState => !prevState);
  }

  const handleAcceptGameInvite = async (gameId: string) => {
    console.log("Accepting invite to game:", gameId);
    try {
      await joinGame(gameId, profile?.id || '');
      await addGameToUser(gameId, profile?.id || '');
      await removeGameFromPendingInvites(profile?.id || '', gameId);
    } catch (error) {
      console.error("Error accepting game invite:", error);
    }
  };

  const handleDeclineGameInvite = async (gameId: string) => {
    console.log("Declining invite from game:", gameId);
    try {
      await removeGameFromPendingInvites(profile?.id || '', gameId);
    } catch (error) {
      console.error("Error declining game invite:", error);
    }
  };

  const handleToggleClubCreationModal = () => {
    setShowClubCreationModal(!showClubCreationModal);
  }

  const handleLogout = async () => {
    console.log('fetching...logout');
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user && user.uid) {
    userGames = games.filter(game => currentGames?.includes(game.id));
    // userTeams = dataContext.teams.filter(team => teams?.includes(team.id));
  }

  if (profile) {
    // Ensure favoriteLocations is an array before using it
    const favoriteLocationsIds = profile.favoriteLocations || [];
    favoriteLocations = dataContext.locations.filter(location => 
      favoriteLocationsIds.includes(location.id)
    );
      //collect pending game invites
    pendingInvites = games.filter(game => 
      profile.pendingInvites.includes(game.id)
    );

    userClubs = dataContext.clubs.filter(club => 
      (profile?.clubs || []).includes(club.id)
    );    
  }

  return (
    <div>
      {user ? (
        <div className='profile-container'>
          <p>Welcome, {username}</p>
          <button onClick={handleLogout}>Log Out</button>
          <div>
            <h2>Profile Stats</h2>
            <h3>Points: {points}</h3>
            <h3>Games Hosted: {gamesHosted}</h3>
            <h3>Games Joined: {gamesJoined}</h3>
            <h3>Network size: {network.length}</h3>
          </div>
          <button onClick={handleToggleEditModal}>Edit Profile</button>
          <button onClick={handleToggleClubCreationModal}>Create Club</button>
          <div className='user-lists-container'>
            <div className="user-games-container">
              <h2>Your Current Games</h2>
              <GamesList games={userGames} onDeleteGame={() => {}} includePending={false}/>
            </div>
            <div className="user-locations-container">
              <h2>Favorite Locations</h2>
              <LocationsList locations={favoriteLocations} />
            </div>
            <div className="invites-container">
              <h2>Your Game Invites</h2>
              {pendingInvites.length > 0 ? (
                pendingInvites.map((game) => (
                  <GameInviteItem
                    key={game.id}
                    game={game}
                    handleAcceptInvite={handleAcceptGameInvite} // Ensure the lambda takes two arguments
                    handleDeclineInvite={handleDeclineGameInvite} // Ensure the lambda takes two arguments
                  />
                ))
              ) : (
                <p>No game invitations.</p>
              )}
            </div>
            <div className="invites-container">
              <h2>Your Clubs</h2>
              {userClubs.length > 0 ? (
                userClubs.map((club) => (
                  <ClubItem
                    key={club.id}
                    club={club} />
                ))
              ) : (
                <p>No clubs.</p>
              )}
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
          editMode={false}
        />
      )}
      {showClubCreationModal && (
        <ClubCreationModal show={showClubCreationModal} onClose={handleToggleClubCreationModal}/>
      )}
      {showEditModal && (
        <ProfileCreationModal 
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          editMode={true}
        />
      )}
    </div>
  );
};
