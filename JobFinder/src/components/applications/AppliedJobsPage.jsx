import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobInteractions } from '../../context/JobInteractionContext';
import userService from '../services/userService';

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'appliedDate'
  });

  useJobInteractions();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await userService.getAppliedJobs();
      // Normalize the data structure
      const normalizedData = data.map(item => {
        // Handle different data structures from backend
        if (item.job) {
          // If it's an application object with job details
          return {
            _id: item._id,
            job: item.job,
            appliedAt: item.appliedAt || item.createdAt,
            status: item.status || 'pending'
          };
        } else {
          // If it's just a job object
          return {
            _id: item._id,
            job: item,
            appliedAt: item.appliedAt || item.createdAt,
            status: 'pending'
          };
        }
      });
      
      setAppliedJobs(normalizedData);
    } catch (err) {
      setError(err.error || 'Failed to fetch applied jobs');
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort jobs
  const filteredJobs = appliedJobs
    .filter(application => {
      const job = application.job;
      if (!job) return false;
      
      // Status filter
      if (filters.status !== 'all' && application.status !== filters.status) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          job.title?.toLowerCase().includes(searchTerm) ||
          job.company?.toLowerCase().includes(searchTerm) ||
          job.location?.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'appliedDate':
          return new Date(b.appliedAt) - new Date(a.appliedAt);
        case 'jobTitle':
          return (a.job?.title || '').localeCompare(b.job?.title || '');
        case 'company':
          return (a.job?.company || '').localeCompare(b.job?.company || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'reviewed':
        return 'bg-info';
      case 'interview':
        return 'bg-primary';
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">My Applications</h1>
              <p className="text-muted">
                Track the status of your job applications ({filteredJobs.length} applications)
              </p>
            </div>
            <Link to="/jobs" className="btn btn-primary">
              <i className="bi bi-search me-2"></i>
              Find More Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Filters */}
      {appliedJobs.length > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="appliedDate">Recently Applied</option>
                  <option value="jobTitle">Job Title</option>
                  <option value="company">Company</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({ status: 'all', search: '', sortBy: 'appliedDate' })}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      {appliedJobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-briefcase text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h3>No Applications Yet</h3>
              <p className="text-muted mb-4">
                You haven't applied to any jobs yet. Start exploring opportunities and apply to positions that interest you.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/jobs" className="btn btn-primary px-4">
                  <i className="bi bi-search me-2"></i>
                  Browse Jobs
                </Link>
                <Link to="/saved-jobs" className="btn btn-outline-secondary px-4">
                  <i className="bi bi-bookmark me-2"></i>
                  View Saved Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-4">
          <div className="alert alert-info">
            <h5>No applications match your filters</h5>
            <p className="mb-0">Try adjusting your search criteria to see more results.</p>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((application) => {
                  const job = application.job;
                  
                  if (!job) {
                    return (
                      <tr key={application._id}>
                        <td colSpan="5" className="text-center text-muted">
                          Job information unavailable
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={application._id}>
                      <td>
                        <div>
                          <h6 className="mb-0">
                            <Link 
                              to={`/jobs/${job._id}`} 
                              className="text-decoration-none"
                            >
                              {job.title}
                            </Link>
                          </h6>
                          <small className="text-muted">
                            {job.location} • {job.jobType}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="company-logo bg-light rounded p-2 me-2">
                            <i className="bi bi-building fs-6 text-primary"></i>
                          </div>
                          <span>{job.company}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatDate(application.appliedAt)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(application.status)} px-2 py-1`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            to={`/jobs/${job._id}`} 
                            className="btn btn-sm btn-outline-primary"
                            title="View job details"
                          >
                            <i className="bi bi-eye me-1"></i>View
                          </Link>
                          {application.status === 'interview' && (
                            <button className="btn btn-sm btn-outline-success" title="Interview scheduled">
                              <i className="bi bi-calendar-event me-1"></i>Interview
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Statistics */}
      {appliedJobs.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-primary bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-primary mb-0">{appliedJobs.length}</h4>
                <small className="text-muted">Total Applications</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-warning bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-warning mb-0">
                  {appliedJobs.filter(app => app.status === 'pending').length}
                </h4>
                <small className="text-muted">Pending</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-info bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-info mb-0">
                  {appliedJobs.filter(app => ['reviewed', 'interview'].includes(app.status)).length}
                </h4>
                <small className="text-muted">In Progress</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-success bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-success mb-0">
                  {appliedJobs.filter(app => app.status === 'accepted').length}
                </h4>
                <small className="text-muted">Accepted</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {appliedJobs.length > 0 && (
        <div className="mt-4">
          <div className="card bg-light border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Application Tips
              </h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Follow Up</h6>
                  <p className="text-muted small mb-0">
                    If you haven't heard back within a week, consider sending a polite follow-up email.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Stay Organized</h6>
                  <p className="text-muted small mb-0">
                    Keep track of application deadlines, interview dates, and company contacts.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Keep Applying</h6>
                  <p className="text-muted small mb-0">
                    Don't put all your eggs in one basket. Continue applying to suitable positions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;