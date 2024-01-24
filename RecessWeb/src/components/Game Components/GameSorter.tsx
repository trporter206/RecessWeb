import React from 'react';

interface GameSorterProps {
  gameSortMethod: string;
  setGameSortMethod: (method: string) => void;
  onSortChange: (method: string) => void;
}

const GameSorter: React.FC<GameSorterProps> = ({ gameSortMethod, setGameSortMethod, onSortChange }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value;
    setGameSortMethod(newMethod);
    onSortChange(newMethod);
  };

  return (
    <>
      <label htmlFor="sort">Sort Games: </label>
      <select id="sort" value={gameSortMethod} onChange={handleSortChange}>
        <option value="">Select...</option>
        <option value="players">Number of Players</option>
        <option value="alphabetical">Alphabetically by Location</option>
        <option value="minimumPoints">Minimum Points</option>
      </select>
    </>
  );
};

export default GameSorter;
