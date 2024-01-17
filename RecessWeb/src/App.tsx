import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LandingPage } from './pages/LandingPage';

export const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/" element={<LandingPage />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};