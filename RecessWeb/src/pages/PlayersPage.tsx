import { useContext, useState, useEffect, useRef } from 'react';
import { DataContext } from '../services/DataProvider';
import '../styles/main.css';
import { PlayersList } from '../components/User Components/PlayersList';
import { TeamsList } from '../components/Team Components/TeamsList';
import { ClubsList } from '../components/Club Components/ClubsList';

export const PlayersPage = () => {
  const data = useContext(DataContext);
  const [view, setView] = useState('players');
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTab = document.querySelector(`.tab-button[data-view="${view}"]`);
    if (activeTab && sliderRef.current) {
      const activeTabElement = activeTab as HTMLElement; // Type assertion here
      sliderRef.current.style.width = `${activeTabElement.offsetWidth}px`;
      sliderRef.current.style.left = `${activeTabElement.offsetLeft}px`;
    }
  }, [view]);
  

  return (
    <div className="main-container">
      <div className="tabs-container">
        <button className="tab-button" data-view="players" onClick={() => setView('players')}>Players</button>
        <button className="tab-button" data-view="teams" onClick={() => setView('teams')}>Teams</button>
        <button className="tab-button" data-view="clubs" onClick={() => setView('clubs')}>Clubs</button>
        <div className="slider" ref={sliderRef}></div>
      </div>
      {view === 'players' && <PlayersList users={data.users} />}
      {view === 'teams' && <TeamsList teams={data.teams} />}
      {view === 'clubs' && <ClubsList clubs={data.clubs} />}
    </div>
  );
};
