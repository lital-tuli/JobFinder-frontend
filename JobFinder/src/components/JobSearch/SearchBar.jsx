import React from 'react';
import FormField from '../common/FormField/FormField';
import Button from '../common/ui/LoadingSpinner/Button/Button';

const SearchBar = ({ searchTerm, onSearchChange, onSearch, loading }) => (
  <div className="search-bar card shadow-sm border-0 mb-4">
    <div className="card-body p-4">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
        <div className="row g-3">
          <div className="col-md-8">
            <FormField
              type="text"
              placeholder="Job title, keywords, or company name..."
              value={searchTerm}
              onChange={onSearchChange}
              className="search-input"
            />
          </div>
          <div className="col-md-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              loadingText="Searching..."
              className="w-100"
            >
              <i className="bi bi-search me-2"></i>
              Search Jobs
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
);

export default SearchBar;