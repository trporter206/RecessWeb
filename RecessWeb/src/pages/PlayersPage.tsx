import { useContext, useState, useEffect, useRef } from 'react';
import { DataContext } from '../services/DataProvider';
import '../styles/main.css';
import { PlayersList } from '../components/User Components/PlayersList';
// import { TeamsList } from '../components/Team Components/TeamsList';
import { ClubsList } from '../components/Club Components/ClubsList';

export const PlayersPage = () => {
  const data = useContext(DataContext);
  const [view, setView] = useState('players');
  const [textBlurb, setTextBlurb] = useState('A list of players');
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTab = document.querySelector(`.tab-button[data-view="${view}"]`);
    if (activeTab && sliderRef.current) {
      const activeTabElement = activeTab as HTMLElement;
      sliderRef.current.style.width = `${activeTabElement.offsetWidth}px`;
      sliderRef.current.style.left = `${activeTabElement.offsetLeft}px`;
    }

    // Update the text blurb based on the current view
    switch (view) {
      case 'players':
        setTextBlurb('Find players in your neighborhood to play with.');
        break;
      // case 'teams':
      //   setTextBlurb('Look for a team to join and compete with others for a chance at real world prizes.');
      //   break;
      case 'clubs':
        setTextBlurb('Join a club to meet new people and play games together.');
        break;
      default:
        setTextBlurb('Select a category to see more information.');
    }
  }, [view]);

  return (
    <div className="main-container">
      <div className="tabs-container">
        <button className="tab-button" data-view="players" onClick={() => setView('players')}>Players</button>
        <button className="tab-button" data-view="clubs" onClick={() => setView('clubs')}>Clubs</button>
        <div className="slider" ref={sliderRef}></div>
      </div>
      <p className="text-blurb">{textBlurb}</p> 
      {view === 'players' && <PlayersList users={data.users} />}
      {view === 'clubs' && <ClubsList clubs={data.clubs} />}
    </div>
  );
};
