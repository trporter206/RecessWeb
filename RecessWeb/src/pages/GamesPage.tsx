import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../services/UserContext';
import { Game } from '../models/Game';
import { fetchGames } from '../services/GameServices';
import { GamesList } from '../components/Game Components/GamesList';
import { GameCreationModal } from '../components/Game Components/GameCreationModal';

export const GamesPage = () => {
    const context = useContext(UserContext);
    const user = context?.user;
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        if (user) {
            setShowModal(true);
        } else {
            navigate('/profile'); // Redirect to profile page if not logged in
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleGameCreated = async () => {
        await fetchAndSetGames();
        handleCloseModal();
    }

    const fetchAndSetGames = async () => {
        const fetchedGames = await fetchGames();
        setGames(fetchedGames);
    };

    useEffect(() => {
        fetchAndSetGames();
    }, []);

    const handleDeleteGame = (gameId: String) => {
        setGames(games.filter(game => game.id !== gameId));
    };

    return (
        <div>
            <h1>Find Games</h1>
            {!showModal && <button onClick={handleOpenModal}>Host Pickleball Game</button>}
            {showModal && (
                <GameCreationModal 
                    show={showModal} 
                    onClose={handleCloseModal} 
                    onGameCreated={handleGameCreated}
                />
            )}
            <div>
                <GamesList games={games} onDeleteGame={handleDeleteGame}/>
            </div>
        </div>
    );
};
