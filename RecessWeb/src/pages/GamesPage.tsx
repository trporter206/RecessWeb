import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../services/UserContext';
import { DataContext } from '../services/DataProvider';
import { GamesList } from '../components/Game Components/GamesList';
import { GameCreationModal } from '../components/Game Components/GameCreationModal';

export const GamesPage = () => {
    const userContext = useContext(UserContext);
    const user = userContext ? userContext.user : null;
    const navigate = useNavigate();
    const { games, removeGame } = useContext(DataContext); // Use games and removeGame from DataContext
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
    };

    const handleGameCreated = () => {
        // No need to fetch games here, as it should be automatically updated by the DataContext
        handleCloseModal();
    };

    const handleDeleteGame = (gameId: string) => {
        removeGame(gameId); // Update DataContext
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