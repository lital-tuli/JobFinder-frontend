import { useState, useEffect } from 'react';
import { useDebounce } from "../../hooks/useDebounce";
const JobFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    q: '',
    jobTypes: [],
    workLocation: [],
    experienceLevel: [],
    minSalary: '',
    maxSalary: '',
    sortBy: 'relevance'
  });

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    onFiltersChange(debouncedFilters);
  }, [debouncedFilters, onFiltersChange]);

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleInputChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="job-filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.q}
          onChange={(e) => handleInputChange('q', e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h4>Job Type</h4>
        {['full-time', 'part-time', 'contract', 'freelance'].map(type => (
          <label key={type}>
            <input
              type="checkbox"
              checked={filters.jobTypes.includes(type)}
              onChange={() => handleCheckboxChange('jobTypes', type)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Work Location</h4>
        {['remote', 'hybrid', 'on-site'].map(location => (
          <label key={location}>
            <input
              type="checkbox"
              checked={filters.workLocation.includes(location)}
              onChange={() => handleCheckboxChange('workLocation', location)}
            />
            {location.charAt(0).toUpperCase() + location.slice(1)}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Experience Level</h4>
        {['entry', 'mid', 'senior'].map(level => (
          <label key={level}>
            <input
              type="checkbox"
              checked={filters.experienceLevel.includes(level)}
              onChange={() => handleCheckboxChange('experienceLevel', level)}
            />
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Salary Range</h4>
        <input
          type="number"
          placeholder="Min salary"
          value={filters.minSalary}
          onChange={(e) => handleInputChange('minSalary', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max salary"
          value={filters.maxSalary}
          onChange={(e) => handleInputChange('maxSalary', e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h4>Sort by</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date Posted</option>
          <option value="salary">Salary</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilters;