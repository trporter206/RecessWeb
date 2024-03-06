import React, { useState } from "react";
import { List as ListIcon, Map as MapIcon } from "@mui/icons-material";

interface FilterBarProps {
  onFiltersChange: (filters: { [key: string]: string }) => void;
  onSearch: (searchQuery: string) => void;
  onToggleView: (showMap: boolean) => void;
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

export const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange, onSearch, onToggleView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  const handleToggleView = () => {
    setShowMap(!showMap);
    onToggleView(!showMap);
  };

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
    setOpenDropdown(null); // Close the dropdown after selection
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
    onFiltersChange({}); // Reset filters
    onSearch(""); // Reset search
  };

  const toggleDropdown = (category: string) => {
    setOpenDropdown(category === openDropdown ? null : category);
  };

  return (
    <div className="filter-bar-container">
      <div className="search-bar-container">
        <div className="toggle-view-container">
          <button onClick={handleToggleView} className="toggle-view-button">
            {showMap ? <ListIcon /> : <MapIcon />}
          </button>
        </div>
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="filter-container">
        {Object.entries(filters).map(([category, options]) => (
          <div key={category} className="filter-category">
            <div className="filter-pillbox" onClick={() => toggleDropdown(category)}>
              {category}
              {selectedFilters[category] && <span className="filter-badge">{selectedFilters[category]}</span>}
            </div>
            {openDropdown === category && (
              <div className="filter-dropdown">
                {options.map((option) => (
                  <div
                    key={`${category}-${option}`}
                    onClick={() => handleFilterClick(category, option)}
                    className={`filter-option ${selectedFilters[category] === option ? "selected" : ""}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleResetFilters} className="filter-reset-button">
        Reset Filters
      </button>
    </div>
  );
};