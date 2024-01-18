import React from 'react';
import { Game } from '../models/Game';
import { GameItem } from './GameItem';

type GamesListProps = {
    games: Game[];
};

export const GamesList: React.FC<GamesListProps & { onDeleteGame: (gameId: string) => void }> = ({ games, onDeleteGame }) => {
    return (
        <div>
            {games.map(game => (
                <GameItem 
                    key={game.id}
                    id={game.id}
                    locationId={game.locationId}
                    players={[]}
                    time={game.time}
                    onDelete={onDeleteGame} />
            ))}
        </div>
    );
};