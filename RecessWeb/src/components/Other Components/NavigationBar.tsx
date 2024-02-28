import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css'
import { UserContext } from '../../services/UserContext'; // Adjust the import path according to your project structure

export const NavigationBar = () => {
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    const profile = userContext ? userContext.profile : null;

    return (
        <nav className='nav-style'>
            <ul className='nav-buttons' style={{ listStyleType: 'none' }}>
                <h2><li><Link to="/Home">Recess</Link></li></h2>
                <h2><li><Link to="/">Explore</Link></li></h2>
                <h2><li><Link to="/players">Community</Link></li></h2>
                <h2><li><Link to="/Games">Games</Link></li></h2>
                {user ? (
                    <h2><li><Link to="/profile">{profile?.username}</Link></li></h2>
                ) : (
                    <h2><li><Link to="/profile">Login</Link></li></h2>
                )}
            </ul>
        </nav>
    );
};
