import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (category: string, option: string) => void;
  onSearch: (searchQuery: string) => void;
}

interface Filters {
  [key: string]: string[];
}

const filters: Filters = {
  "Type": ["Indoor", "Outdoor", "Indoor/Outdoor"],
  "Courts": ["1", "2", "3", "3+"],
  "Has Lights": ["Yes", "No"],
  "Games Scheduled": ["Yes", "No"],
  "Owned": ["Yes", "No"],
};

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch(value); // Call the search callback
  };
  
  const handleFilterClick = (category: string, option: string) => {
    onFilterChange(category, option); // Call the callback with the selected filter
  };

  const handleResetFilters = () => {
    onFilterChange('', ''); 
    setSearchQuery(''); // Also reset the search query
    onSearch(''); // Reset search results
  };

  return (
    <div className="filter-bar-container">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {Object.entries(filters).map(([category, options]) => (
        <div key={category} className="filter-category">
          <h3>{category}</h3>
          <div className="filter-options">
            {options.map((option) => (
              <button
                key={`${category}-${option}`}
                onClick={() => handleFilterClick(category, option)}
                className="filter-option-button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="filter-options">
        <button
          onClick={handleResetFilters}
          className="filter-reset-button"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
