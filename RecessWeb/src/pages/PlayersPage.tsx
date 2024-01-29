import { useContext } from 'react';
import { DataContext } from '../services/DataProvider'; // Import the context
import '../styles/main.css';
import { PlayersList } from '../components/User Components/PlayersList';

export const PlayersPage = () => {
  // Use LocationsContext to access locations
  const data = useContext(DataContext);

  return (
    <div className="main-container">
      <h1>Players</h1>
      <div className='list-container'>
        <PlayersList users={data.users} />
      </div>
    </div>
  );
};
