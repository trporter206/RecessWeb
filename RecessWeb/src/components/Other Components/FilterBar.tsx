interface FilterBarProps {
    onFilterChange: (category: string, option: string) => void;
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
  
  export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const handleFilterClick = (category: string, option: string) => {
        onFilterChange(category, option); // Call the callback with the selected filter
    };

    const handleResetFilters = () => {
        onFilterChange('', ''); // Call the callback with empty strings to indicate a reset
    };
  
    return (
        <div className="filter-bar-container">
          <div className="filter-reset-button-container">
            <button
              onClick={handleResetFilters}
              className="filter-reset-button"
            >
              Reset Filters
            </button>
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
        </div>
      );
};

  
  