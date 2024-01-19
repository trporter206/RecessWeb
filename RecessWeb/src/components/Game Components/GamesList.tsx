// GamesList component
import React from 'react';
import { GameItem } from './GameItem';
import { Game } from '../../models/Game';

type GamesListProps = {
  games: Game[];
  onDeleteGame: (gameId: string) => void;
};

export const GamesList: React.FC<GamesListProps> = ({ games, onDeleteGame }) => {
  return (
    <div>
      {games.map(game => (
        <GameItem 
          key={game.id}
          game={game}
          onDelete={onDeleteGame} />
      ))}
    </div>
  );
};
