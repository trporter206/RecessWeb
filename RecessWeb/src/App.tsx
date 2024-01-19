import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './components/Register';
import { LandingPage } from './pages/LandingPage';
import { NavigationBar } from './components/NavigationBar';
import { GamesPage } from './pages/GamesPage'; // Import the Games component
import { LocationsPage } from './pages/LocationsPage'; // Import the LocationsPage component
import { LocationsProvider } from './services/LocationsProvider';
import { ProfilePage } from './pages/ProfilePage';
import { UserProvider } from './services/UserContext';

export const App = () => {

  return (
    <UserProvider>
      <LocationsProvider>
        <Router>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <NavigationBar />
          </div>
          <Routes>
            <Route path="/register" Component={Register} />
            <Route path="/games" Component={GamesPage} /> // Use the imported Games component
            <Route path="/locations" Component={LocationsPage} /> // Use the imported LocationsPage component
            <Route path="/profile" Component={ProfilePage} /> // Use the imported ProfilePage component
            <Route path="/" element={<LandingPage />} />
            {/* Other routes */}
          </Routes>
        </Router>
      </LocationsProvider>
    </UserProvider>
  );
};