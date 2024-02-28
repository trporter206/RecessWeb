import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NavigationBar } from './components/Other Components/NavigationBar';
import { GamesPage } from './pages/GamesPage'; // Import the Games component
import { LocationsPage } from './pages/LocationsPage'; // Import the LocationsPage component
import { DataProvider } from './services/DataProvider';
import { ProfilePage } from './pages/ProfilePage';
import { UserProvider } from './services/UserContext';
import { PlayersPage } from './pages/PlayersPage'; // Import the PlayersPage component
// import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {

  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <NavigationBar />
          <Routes>
            <Route path="/games" element={<GamesPage />} /> // Use the imported Games element
            <Route path="/players" element={<PlayersPage />} /> // Use the imported PlayersPage element
            <Route path="/locations" element={<LocationsPage />} /> // Use the imported LocationsPage element
            <Route path="/profile" element={<ProfilePage />} /> // Use the imported ProfilePage component
            <Route path="/" element={<LandingPage />} />
            {/* Other routes */}
          </Routes>
        </Router>
      </DataProvider>
    </UserProvider>
  );
};