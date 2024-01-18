import { useEffect, useState } from 'react';
import { createGame } from '../services/GameServices';
import { Game } from '../models/Game';
import fetchGames from '../services/GameServices';
import { generateRandomGame } from '../services/GameServices';
import { GamesList } from '../components/GamesList';

export const GamesPage = () => {
    const [games, setGames] = useState<Game[]>([]);

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

    const handleAddGame = async () => {
        console.log("creating game");
        const fakeGame = generateRandomGame();
      
        const game = {
            locationId: 'N9pbOzXeYTCxXu86nYAY', // use a real location ID
            players: fakeGame.players,
            time: fakeGame.time,
        };
      
        try {
            await createGame(game);
            await fetchAndSetGames();
        } catch (error) {
            console.error('Error in handleAddGame:', error);
        }
    };
    

    return (
        <div>
            <h1>Games</h1>
            <button onClick={handleAddGame}>Add Fake Game</button>
            <div>
                <GamesList games={games} onDeleteGame={handleDeleteGame}/>
            </div>
        </div>
    );
};
