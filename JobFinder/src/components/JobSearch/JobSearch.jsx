import React from 'react';
import { useJobSearch } from './hooks/useJobSearch';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortOptions from './components/SortOptions';
import ViewToggle from './components/ViewToggle';
import SearchResults from './components/SearchResults';

const JobSearch = () => {
  const searchProps = useJobSearch();

  return (
    <div className="job-search">
      <SearchBar 
        searchTerm={searchProps.searchTerm}
        onSearchChange={searchProps.handleSearchChange}
        onSearch={searchProps.handleSearch}
        loading={searchProps.loading}
      />
      
      <div className="search-controls d-flex justify-content-between align-items-center mb-4">
        <FilterPanel 
          filters={searchProps.filters}
          onFilterChange={searchProps.handleFilterChange}
          filterOptions={searchProps.filterOptions}
        />
        
        <div className="d-flex gap-2">
          <SortOptions 
            sortBy={searchProps.sortBy}
            onSortChange={searchProps.handleSortChange}
          />
          <ViewToggle 
            viewMode={searchProps.viewMode}
            onViewModeChange={searchProps.handleViewModeChange}
          />
        </div>
      </div>

      <SearchResults 
        jobs={searchProps.filteredJobs}
        loading={searchProps.loading}
        error={searchProps.error}
        viewMode={searchProps.viewMode}
        onSaveJob={searchProps.handleSaveJob}
        savedJobIds={searchProps.savedJobIds}
      />
    </div>
  );
};

export default JobSearch;