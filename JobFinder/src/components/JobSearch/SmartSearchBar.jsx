import React from 'react';
import PropTypes from 'prop-types';

const SmartSearchBar = ({
  searchTerm,
  location,
  onSearchChange,
  onLocationChange,
  onSearch,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm, location);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row gap-3">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Search jobs, skills, companies..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search jobs or keywords"
      />
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Location (city, state, or remote)"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Location"
      />
      <button
        className="btn btn-warning btn-lg"
        type="button"
        onClick={() => onSearch(searchTerm, location)}
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
