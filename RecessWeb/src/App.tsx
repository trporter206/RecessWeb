import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NavigationBar } from './components/NavigationBar';
import { GamesPage } from './pages/GamesPage'; // Import the Games component
import { LocationsPage } from './pages/LocationsPage'; // Import the LocationsPage component
import { DataProvider } from './services/DataProvider';
import { ProfilePage } from './pages/ProfilePage';
import { UserProvider } from './services/UserContext';
import { PlayersPage } from './pages/PlayersPage'; // Import the PlayersPage component


export const App = () => {

  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <NavigationBar />
          <Routes>
            <Route path="/games" Component={GamesPage} /> // Use the imported Games component
            <Route path="/players" Component={PlayersPage} /> // Use the imported PlayersPage component
            <Route path="/locations" Component={LocationsPage} /> // Use the imported LocationsPage component
            <Route path="/profile" Component={ProfilePage} /> // Use the imported ProfilePage component
            <Route path="/" element={<LandingPage />} />
            {/* Other routes */}
          </Routes>
        </Router>
      </DataProvider>
    </UserProvider>
  );
};