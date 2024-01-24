import React from 'react';

interface LocationSorterProps {
  sortMethod: string;
  setSortMethod: (value: string) => void;
  onSortChange: (newMethod: string) => void;
}

const LocationSorter: React.FC<LocationSorterProps> = ({ sortMethod, setSortMethod, onSortChange }) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value;
    setSortMethod(newMethod);
    onSortChange(newMethod);
  };

  return (
    <>
      <label htmlFor="sort">Sort Locations: </label>
      <select id="sort" value={sortMethod} onChange={handleSortChange}>
        <option value="">Select...</option>
        <option value="alphabetically">Alphabetically</option>
        <option value="games">By Number of Games</option>
      </select>
    </>
  );
};

export default LocationSorter;
