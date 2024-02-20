import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import { LoginForm } from '../components/User Components/LoginForm';
import { ProfileCreationModal } from '../components/User Components/ProfileCreationModal';
import { UserContext } from '../services/UserContext';
import { DataContext } from '../services/DataProvider';
import { GamesList } from '../components/Game Components/GamesList';
import { Game } from '../models/Game'; // Import the Game type
// import { Team } from '../models/Team'; // Import the Team type
import { Location } from '../models/Location'; // Import the Location type
import { LocationsList } from '../components/Location Components/LocationsList';
// import { TeamCreationModal } from '../components/Team Components/TeamCreationModal';
// import { TeamsList } from '../components/Team Components/TeamsList';
// import { TeamInviteItem } from '../components/Team Components/TeamInviteItem';
import { addGameToUser, removeGameFromPendingInvites } from '../services/UserServices';
import { ClubCreationModal } from '../components/Club Components/ClubCreationModal';
import { GameInviteItem } from '../components/Game Components/GameInviteItem';
import { joinGame } from '../services/GameServices';

export const ProfilePage = () => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  // const { addTeamToPlayerContext, removeTeamInviteContext, addMemberToTeamContext } = dataContext;
  const [showProfileCreationModal, setShowProfileCreationModal] = useState(false);
  const [showClubCreationModal, setShowClubCreationModal] = useState(false);
  // const [showTeamCreationModal, setShowTeamCreationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const user = userContext?.user;
  const profile = userContext?.profile;
  const games = dataContext?.games || []; 
  const { username, points, gamesHosted, gamesJoined, network, currentGames } = profile || 
  { username: '', points: 0, totalGames: 0, gamesHosted: 0, gamesJoined: 0, network: [] };

  let userGames: Game[] = [];
  let favoriteLocations: Location[] = [];
  let pendingInvites: Game[] = [];
  // let teamInvites: Team[] = [];
  // let userTeams: Team[] = [];

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

  // const handleAcceptInvite = async (teamId: string) => {
  //   console.log("Accepting invite to team:", teamId);
  //   try {
  //     //update firebase. add member to team and remove invite from player
  //     await acceptTeamInvite(teamId, profile?.id || '');
  //     await addTeamToUser(profile?.id || '', teamId);
  //     //update context
  //     addTeamToPlayerContext(teamId, profile?.id || '');
  //     removeTeamInviteContext(teamId, profile?.id || '');
  //     addMemberToTeamContext(teamId, profile?.id || '');
  //   } catch (error) {
  //     console.error("Error accepting team invite:", error);
  //   }
  // };

  // const handleDeclineInvite = async (teamId: string) => {
  //   console.log("Declining invite from team:", teamId);
  //   try {
  //     //firebase
  //     await declineTeamInvite(teamId, profile?.id || '');
  //     //context
  //     removeTeamInviteContext(teamId, profile?.id || '');
  //   } catch (error) {
  //     console.error("Error declining team invite:", error);
  //   }
  // };

  const handleToggleClubCreationModal = () => {
    setShowClubCreationModal(!showClubCreationModal);
  }

  // const handleToggleTeamCreationModal = () => {
  //   setShowTeamCreationModal(!showTeamCreationModal);
  // }

  const handleLogout = async () => {
    console.log('fetching...logout');
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // if (pendingTeamInvites) {
  //   teamInvites = dataContext.teams.filter(team =>
  //     pendingTeamInvites.includes(team.id)
  //   );
  // }

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
  }

  return (
    <div className='main-container'>
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
          {/* <button onClick={handleToggleTeamCreationModal}>Create Team</button> */}
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
            {/* <div className="user-teams-container">
              <h2>Your Teams</h2>
              {userTeams.length > 0 ? (
                <TeamsList teams={userTeams} />
              ) : (
                <p>You are not a member of any teams.</p>
              )}
            </div> */}
            {/* <div className="invites-container">
              <h2>Your Team Invites</h2>
              {teamInvites.length > 0 ? (
                teamInvites.map((team) => (
                  <TeamInviteItem
                    key={team.id}
                    team={team}
                    onAccept={handleAcceptInvite} // Ensure the lambda takes two arguments
                    onDecline={handleDeclineInvite} // Ensure the lambda takes two arguments
                  />
                ))
              ) : (
                <p>No team invitations.</p>
              )}
            </div> */}
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
      {/* {showTeamCreationModal && (
        <TeamCreationModal show={showTeamCreationModal} onClose={handleToggleTeamCreationModal}/>
      )} */}
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
