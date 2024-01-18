import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LandingPage } from './pages/LandingPage';
import { NavigationBar } from './components/NavigationBar';
import { GamesPage } from './pages/GamesPage'; // Import the Games component
import { LocationsPage } from './pages/LocationsPage'; // Import the LocationsPage component
import { LocationsProvider } from './services/LocationsProvider';

export const App = () => {

  return (
    <LocationsProvider>
      <Router>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NavigationBar />
        </div>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/games" Component={GamesPage} /> // Use the imported Games component
          <Route path="/locations" Component={LocationsPage} /> // Use the imported LocationsPage component
          <Route path="/" element={<LandingPage />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </LocationsProvider>
  );
};