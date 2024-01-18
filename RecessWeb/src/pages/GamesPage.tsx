import { useEffect, useState } from 'react';
import { Game } from '../models/Game';
import fetchGames from '../services/GameServices';
import { GamesList } from '../components/GamesList';
import { GameCreationModal } from '../components/GameCreationModal';

export const GamesPage = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    }

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
            <GameCreationModal 
                show={showModal} 
                onClose={handleCloseModal} 
                onGameCreated={handleGameCreated}
            />
            <div>
                <GamesList games={games} onDeleteGame={handleDeleteGame}/>
            </div>
        </div>
    );
};
