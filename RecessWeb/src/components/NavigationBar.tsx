import { Link } from 'react-router-dom';
import '../styles/main.css'

export const NavigationBar = () => {
    return (
        <nav className='nav-style'>
            <ul className='nav-buttons' style={{ listStyleType: 'none' }}>
                <h2><li><Link to="/">Recess</Link></li></h2>
                <h2><li><Link to="/players">Community</Link></li></h2>
                <h2><li><Link to="/Games">Games</Link></li></h2>
                <h2><li><Link to="/profile">Profile</Link></li></h2>
            </ul>
        </nav>
    );
};
