import React from 'react';
import { GameItem } from './GameItem';
import { Game } from '../../models/Game';

interface GamesListProps {
  games: Game[];
  onDeleteGame: (gameId: string) => void;
  includePending: boolean; // New prop to toggle pending games
}

export const GamesList: React.FC<GamesListProps> = ({ games, onDeleteGame, includePending }) => {
  // Filter games based on the includePending prop
  const filteredGames = games.filter(game => includePending || !game.pending);

  return (
    <div className='playerlist-container'>
      {filteredGames.map(game => (
        <GameItem 
          key={game.id}
          game={game}
          onDelete={onDeleteGame} />
      ))}
    </div>
  );
};
