import React, { useState } from "react";

interface FilterBarProps {
  onFiltersChange: (filters: { [key: string]: string }) => void;
  onSearch: (searchQuery: string) => void;
}

interface Filters {
  [key: string]: string[];
}

const filters: Filters = {
  Type: ["Indoor", "Outdoor", "Indoor/Outdoor"],
  Courts: ["1", "2", "3", "3+"],
  "Has Lights": ["Yes", "No"],
  "Games Scheduled": ["Yes", "No"],
  Owned: ["Yes", "No"],
};

export const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch(value); // Call the search callback
  };

  const handleFilterClick = (category: string, option: string) => {
    // If the filter is already active, remove it from the state
    if (selectedFilters[category] === option) {
      const newFilters = { ...selectedFilters };
      delete newFilters[category]; // Remove the category from the newFilters object
      setSelectedFilters(newFilters);
      onFiltersChange(newFilters); // Pass the updated filters to the parent component
    } else {
      // Otherwise, set or replace the current filter
      const newFilters = { ...selectedFilters, [category]: option };
      setSelectedFilters(newFilters);
      onFiltersChange(newFilters); // Pass the updated filters to the parent component
    }
  };
  

  const handleResetFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
    onFiltersChange({}); // Reset filters
    onSearch(""); // Reset search
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
                className={`filter-option-button ${selectedFilters[category] === option ? "selected" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleResetFilters} className="filter-reset-button">
        Reset Filters
      </button>
    </div>
  );
};
