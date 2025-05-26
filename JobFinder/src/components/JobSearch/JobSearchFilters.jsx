import React from 'react';
import PropTypes from 'prop-types';


const JobSearchFilters = ({
    searchTerm,
    filters,
    sortBy,
    viewMode,
    showFilters,
    loading,
    filterOptions,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onViewModeChange,
    onSearch,
    onClearFilters
}) => {
    return (
        <div className={`card shadow-sm border-0 mb-4 ${showFilters ? '' : 'd-none d-md-block'}`}>
            <div className="card-body p-4">
                {/* Main Search Bar */}
                <div className="row g-3 mb-3">
                    <div className="col-md-5">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-0">
                                <i className="bi bi-search text-primary"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 bg-light"
                                placeholder="Job title, keywords, or company name..."
                                value={searchTerm}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-0">
                                <i className="bi bi-geo-alt text-primary"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 bg-light"
                                placeholder="Location (city, state, or remote)"
                                value={filters.location}
                                onChange={(e) => onFilterChange('location', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button 
                            className="btn btn-primary btn-lg w-100"
                            onClick={onSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search me-2"></i>
                                    Search Jobs
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="row g-3 mb-3">
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filters.jobType}
                            onChange={(e) => onFilterChange('jobType', e.target.value)}
                        >
                            <option value="">All Job Types</option>
                            {filterOptions.jobTypes && filterOptions.jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Company name"
                            value={filters.company}
                            onChange={(e) => onFilterChange('company', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filters.datePosted}
                            onChange={(e) => onFilterChange('datePosted', e.target.value)}
                        >
                            <option value="">Any time</option>
                            <option value="1">Last 24 hours</option>
                            <option value="3">Last 3 days</option>
                            <option value="7">Last week</option>
                            <option value="14">Last 2 weeks</option>
                            <option value="30">Last month</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Min salary"
                            value={filters.salaryMin}
                            onChange={(e) => onFilterChange('salaryMin', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Max salary"
                            value={filters.salaryMax}
                            onChange={(e) => onFilterChange('salaryMax', e.target.value)}
                        />
                    </div>
                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={onClearFilters}
                            title="Clear all filters"
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                </div>

                {/* Sort and View Controls */}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <label className="form-label mb-0 small text-muted">Sort by:</label>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="latest">Latest Jobs</option>
                            <option value="oldest">Oldest Jobs</option>
                            <option value="title">Job Title A-Z</option>
                            <option value="company">Company A-Z</option>
                            <option value="location">Location A-Z</option>
                            <option value="salary_high">Salary High to Low</option>
                            <option value="salary_low">Salary Low to High</option>
                        </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted me-2">View:</span>
                        <div className="btn-group" role="group">
                            <button
                                type="button"
                                className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                onClick={() => onViewModeChange('cards')}
                                title="Card view"
                            >
                                <i className="bi bi-grid-3x3-gap"></i>
                            </button>
                            <button
                                type="button"
                                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                onClick={() => onViewModeChange('table')}
                                title="Table view"
                            >
                                <i className="bi bi-list-ul"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

JobSearchFilters.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    filters: PropTypes.shape({
        location: PropTypes.string,
        jobType: PropTypes.string,
        company: PropTypes.string,
        datePosted: PropTypes.string,
        salaryMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        salaryMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    sortBy: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    showFilters: PropTypes.bool,
    loading: PropTypes.bool,
    filterOptions: PropTypes.shape({
        jobTypes: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    onViewModeChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired
};

export default JobSearchFilters;
