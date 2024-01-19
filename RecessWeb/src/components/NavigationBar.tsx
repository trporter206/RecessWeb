import { Link } from 'react-router-dom';
import '../styles/main.css'

export const NavigationBar = () => {
    return (
        <nav className='nav-style'>
            <ul className='nav-buttons' style={{ listStyleType: 'none' }}>
                <li><Link to="/">Recess</Link></li>
                <li><Link to="/locations">Locations</Link></li>
                <li><Link to="/Games">Games</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
};
