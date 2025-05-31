// src/features/job-search/components/SmartSearchBar.jsx
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useSearchHistory } from '../hooks/useSearchHistory';

const SmartSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { searchHistory, addToHistory } = useSearchHistory();

  // Auto-search on debounced term change
  useEffect(() => {
    if (debouncedSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return searchHistory.slice(0, 5);
    
    return searchHistory
      .filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  }, [searchTerm, searchHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToHistory(searchTerm.trim());
      onSearch(searchTerm.trim());
      setIsOpen(false);
    }
  };

  return (
    <div className="smart-search-bar position-relative">
      <form onSubmit={handleSubmit}>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search text-primary"></i>
          </span>
          <input
            type="text"
            className="form-control border-0 bg-light"
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="search-suggestions position-absolute top-100 start-0 end-0 bg-white shadow-lg rounded-bottom border-top-0 z-index-1000">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="dropdown-item border-0 py-2 px-3 text-start"
              onClick={() => {
                setSearchTerm(suggestion);
                onSearch(suggestion);
                setIsOpen(false);
              }}
            >
              <i className="bi bi-clock-history text-muted me-2"></i>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;