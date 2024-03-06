import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NavigationBar } from './components/Other Components/NavigationBar';
import { GamesPage } from './pages/GamesPage'; // Import the Games component
import { LocationsPage } from './pages/LocationsPage'; // Import the LocationsPage component
import { DataProvider } from './services/DataProvider';
import { ProfilePage } from './pages/ProfilePage';
import { UserProvider } from './services/UserContext';
import { PlayersPage } from './pages/PlayersPage'; // Import the PlayersPage component
import { HomePage } from './pages/HomePage';
import { useEffect, useState } from 'react';

export const App = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const navbar = document.querySelector('.nav-style');
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <NavigationBar />
          <div className='main-container' style={{ paddingTop: `${navbarHeight}px` }}>
            <Routes>
              <Route path="/games" element={<GamesPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/Home" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </UserProvider>
  );
};