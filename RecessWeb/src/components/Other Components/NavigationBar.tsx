import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css';
import { UserContext } from '../../services/UserContext';

export const NavigationBar = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const profile = userContext ? userContext.profile : null;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="nav-style">
      <div className="nav-header">
        <h2>
          <Link to="/Home">Recess</Link>
        </h2>
        <button className="nav-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
      <ul className={`nav-buttons ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={toggleMenu}>
            Explore
          </Link>
        </li>
        <li>
          <Link to="/players" onClick={toggleMenu}>
            Community
          </Link>
        </li>
        <li>
          <Link to="/Games" onClick={toggleMenu}>
            Games
          </Link>
        </li>
        {user ? (
          <li>
            <Link to="/profile" onClick={toggleMenu}>
              {profile?.username}
            </Link>
          </li>
        ) : (
          <li>
            <Link to="/profile" onClick={toggleMenu}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};