import { useContext, useState } from 'react';
import { DataContext } from '../services/DataProvider'; // Import the context
import '../styles/main.css';
import { PlayersList } from '../components/User Components/PlayersList';
import { TeamsList } from '../components/Team Components/TeamsList';

export const PlayersPage = () => {
  const data = useContext(DataContext);
  const [showTeams, setShowTeams] = useState(false);

  return (
    <div className="main-container">
      {showTeams ? <h1>Teams</h1> : <h1>Players</h1>}
      <button onClick={() => setShowTeams(!showTeams)}>
        {showTeams ? 'Show Players' : 'Show Teams'}
      </button>
      {showTeams ? 
        <div className='communityList-container'>
          <TeamsList teams={data.teams} />
        </div>
      : 
      <div className='playerlist-container'>
        <PlayersList users={data.users} />
      </div>
      }
    </div>
  );
};
