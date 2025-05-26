import React from 'react';
import PropTypes from 'prop-types';


const SavedJobsFilters = ({
    filters,
    onFilterChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    filterOptions,
    selectedJobs,
    filteredJobs,
    onSelectAll,
    onBulkUnsave,
    actionLoading
}) => {
    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
                <div className="row g-3 mb-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search saved jobs..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filters.jobType}
                            onChange={(e) => onFilterChange('jobType', e.target.value)}
                        >
                            <option value="">All Types</option>
                            {filterOptions.jobTypes &&
                                filterOptions.jobTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => onFilterChange('location', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Company"
                            value={filters.company}
                            onChange={(e) => onFilterChange('company', e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="savedDate">Recently Saved</option>
                            <option value="postedDate">Recently Posted</option>
                            <option value="jobTitle">Job Title</option>
                            <option value="company">Company</option>
                            <option value="salary">Salary</option>
                        </select>
                    </div>
                    <div className="col-md-1">
                        <div className="btn-group w-100">
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

                {/* Bulk Actions */}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="selectAll"
                            checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                            onChange={onSelectAll}
                        />
                        <label className="form-check-label" htmlFor="selectAll">
                            Select All ({selectedJobs.size} selected)
                        </label>
                    </div>
                    
                    {selectedJobs.size > 0 && (
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={onBulkUnsave}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash me-1"></i>
                                        Remove Selected ({selectedJobs.size})
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

SavedJobsFilters.propTypes = {
    filters: PropTypes.shape({
        search: PropTypes.string,
        jobType: PropTypes.string,
        location: PropTypes.string,
        company: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
    viewMode: PropTypes.string.isRequired,
    onViewModeChange: PropTypes.func.isRequired,
    filterOptions: PropTypes.shape({
        jobTypes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    selectedJobs: PropTypes.instanceOf(Set).isRequired,
    filteredJobs: PropTypes.array.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onBulkUnsave: PropTypes.func.isRequired,
    actionLoading: PropTypes.bool.isRequired,
};

export default SavedJobsFilters;