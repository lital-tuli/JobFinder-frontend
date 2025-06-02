import React from 'react';
import PropTypes from 'prop-types';

const SmartSearchBar = ({
  searchTerm,
  location,
  onSearchChange,
  onLocationChange,
  onSearch,
}) => {
  // הפעלת החיפוש בלחיצה על אנטר או על הכפתור
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row gap-3">
      {/* שדה מילות מפתח */}
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Search jobs, skills, companies..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search jobs or keywords"
      />

      {/* שדה מיקום */}
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Location (city, state, or remote)"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Location"
      />

      {/* כפתור חיפוש */}
      <button
        className="btn btn-warning btn-lg"
        type="button"
        onClick={() => onSearch(searchTerm)}
        aria-label="Search jobs"
      >
        Search
      </button>
    </div>
  );
};

SmartSearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};


export default SmartSearchBar;