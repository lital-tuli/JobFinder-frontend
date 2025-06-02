import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import jobService from '../services/jobService';

const Sandbox = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    totalAdmins: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Test data for sandbox operations
  const [testJobData, setTestJobData] = useState({
    title: 'Test Job Position',
    company: 'Test Company',
    description: 'This is a test job description for sandbox testing.',
    requirements: 'Test requirements for the position.',
    location: 'Test Location',
    salary: '50000-70000',
    jobType: 'Full-time',
    contactEmail: 'test@company.com'
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: false,
    maxJobsPerRecruiter: 10
  });

  // State for role change modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Note: You'll need to create these endpoints in your backend
      const [usersData, jobsData] = await Promise.all([
        userService.getAllUsers(),
        jobService.getAllJobs()
      ]);
      
      setUsers(usersData || []);
      setJobs(jobsData || []);
      
      setStats({
        totalUsers: usersData?.length || 0,
        totalJobs: jobsData?.length || 0,
        activeJobs: jobsData?.filter(job => job.isActive)?.length || 0,
        totalApplications: jobsData?.reduce((acc, job) => acc + (job.applicants?.length || 0), 0) || 0,
        totalAdmins: usersData?.filter(u => u.role === 'admin')?.length || 0
      });
    } catch {
      setError('Failed to fetch admin statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleTestJobCreate = async () => {
    try {
      setLoading(true);
      await jobService.createJob(testJobData);
      setSuccessMessage('Test job created successfully!');
      fetchStats();
    } catch (err) {
      setError('Failed to create test job: ' + (err.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllTestJobs = async () => {
    if (!window.confirm('Are you sure you want to delete all test jobs? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const testJobs = jobs.filter(job => job.company === 'Test Company');
      await Promise.all(testJobs.map(job => jobService.deleteJob(job._id)));
      setSuccessMessage(`Deleted ${testJobs.length} test jobs successfully!`);
      fetchStats();
    } catch (err) {
      setError('Failed to delete test jobs: ' + (err.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setLoading(true);
      await userService.updateUserRole(selectedUser._id, newRole);
      setSuccessMessage(`User role updated to ${newRole} successfully!`);
      setShowRoleModal(false);
      setSelectedUser(null);
      fetchStats();
    } catch (err) {
      setError('Failed to update user role: ' + (err.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (userItem) => {
    setUserToDelete(userItem);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await userService.deleteUser(userToDelete._id);
      setSuccessMessage(`User ${userToDelete.name?.first} ${userToDelete.name?.last} deleted successfully!`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchStats();
    } catch (err) {
      setError('Failed to delete user: ' + (err.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingToggle = (setting) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setSuccessMessage(`${setting} ${systemSettings[setting] ? 'disabled' : 'enabled'} successfully!`);
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'bg-danger';
      case 'recruiter': return 'bg-primary';
      case 'jobseeker': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (!user?.isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin sandbox.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Admin Sandbox</h1>
          <p className="text-muted">Administrative tools and testing environment</p>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-graph-up me-2"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-2"></i>User Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <i className="bi bi-briefcase me-2"></i>Job Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'testing' ? 'active' : ''}`}
            onClick={() => setActiveTab('testing')}
          >
            <i className="bi bi-tools me-2"></i>Testing Tools
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear me-2"></i>System Settings
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3 className="mb-0">{stats.totalUsers}</h3>
                        <p className="mb-0">Total Users</p>
                      </div>
                      <i className="bi bi-people fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3 className="mb-0">{stats.totalJobs}</h3>
                        <p className="mb-0">Total Jobs</p>
                      </div>
                      <i className="bi bi-briefcase fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3 className="mb-0">{stats.activeJobs}</h3>
                        <p className="mb-0">Active Jobs</p>
                      </div>
                      <i className="bi bi-check-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3 className="mb-0">{stats.totalApplications}</h3>
                        <p className="mb-0">Applications</p>
                      </div>
                      <i className="bi bi-file-text fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h3 className="mb-0">{stats.totalAdmins}</h3>
                        <p className="mb-0">Admin Users</p>
                      </div>
                      <i className="bi bi-shield-check fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Quick Actions</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <button 
                          className="btn btn-outline-primary w-100"
                          onClick={fetchStats}
                          disabled={loading}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Refresh Statistics
                        </button>
                      </div>
                      <div className="col-md-6 mb-3">
                        <button 
                          className="btn btn-outline-success w-100"
                          onClick={() => setActiveTab('testing')}
                        >
                          <i className="bi bi-tools me-2"></i>
                          Open Testing Tools
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-pane fade show active">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">User Management</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 10).map(userItem => (
                          <tr key={userItem._id}>
                            <td>{userItem.name?.first} {userItem.name?.last}</td>
                            <td>{userItem.email}</td>
                            <td>
                              <span className={`badge ${getRoleBadgeClass(userItem.role)}`}>
                                {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${userItem.isActive !== false ? 'bg-success' : 'bg-secondary'}`}>
                                {userItem.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleOpenRoleModal(userItem)}
                                  disabled={userItem._id === user._id}
                                >
                                  Change Role
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleOpenDeleteModal(userItem)}
                                  disabled={userItem._id === user._id}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="tab-pane fade show active">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Job Management</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Type</th>
                          <th>Applications</th>
                          <th>Status</th>
                          <th>Posted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.slice(0, 10).map(job => (
                          <tr key={job._id}>
                            <td>{job.title}</td>
                            <td>{job.company}</td>
                            <td><span className="badge bg-info">{job.jobType}</span></td>
                            <td>{job.applicants?.length || 0}</td>
                            <td>
                              <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testing Tools Tab */}
        {activeTab === 'testing' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Job Testing</h5>
                  </div>
                  <div className="card-body">
                    <h6>Create Test Job</h6>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Job Title"
                        value={testJobData.title}
                        onChange={(e) => setTestJobData(prev => ({...prev, title: e.target.value}))}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Company Name"
                        value={testJobData.company}
                        onChange={(e) => setTestJobData(prev => ({...prev, company: e.target.value}))}
                      />
                      <select
                        className="form-control mb-2"
                        value={testJobData.jobType}
                        onChange={(e) => setTestJobData(prev => ({...prev, jobType: e.target.value}))}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <button 
                      className="btn btn-primary me-2"
                      onClick={handleTestJobCreate}
                      disabled={loading}
                    >
                      Create Test Job
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDeleteAllTestJobs}
                      disabled={loading}
                    >
                      Delete All Test Jobs
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Database Operations</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-info" onClick={fetchStats}>
                        <i className="bi bi-database me-2"></i>
                        Refresh Database Stats
                      </button>
                      <button className="btn btn-outline-warning">
                        <i className="bi bi-download me-2"></i>
                        Export Data (Coming Soon)
                      </button>
                      <button className="btn btn-outline-success">
                        <i className="bi bi-upload me-2"></i>
                        Import Data (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-pane fade show active">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">System Settings</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Application Settings</h6>
                    <div className="form-check form-switch mb-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="maintenanceMode"
                        checked={systemSettings.maintenanceMode}
                        onChange={() => handleSystemSettingToggle('maintenanceMode')}
                      />
                      <label className="form-check-label" htmlFor="maintenanceMode">
                        Maintenance Mode
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="allowNewRegistrations"
                        checked={systemSettings.allowNewRegistrations}
                        onChange={() => handleSystemSettingToggle('allowNewRegistrations')}
                      />
                      <label className="form-check-label" htmlFor="allowNewRegistrations">
                        Allow New Registrations
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="requireEmailVerification"
                        checked={systemSettings.requireEmailVerification}
                        onChange={() => handleSystemSettingToggle('requireEmailVerification')}
                      />
                      <label className="form-check-label" htmlFor="requireEmailVerification">
                        Require Email Verification
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Limits & Restrictions</h6>
                    <div className="mb-3">
                      <label className="form-label">Max Jobs per Recruiter</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={systemSettings.maxJobsPerRecruiter}
                        onChange={(e) => setSystemSettings(prev => ({...prev, maxJobsPerRecruiter: e.target.value}))}
                      />
                    </div>
                    <div className="alert alert-info">
                      <small>Note: These settings are for demonstration purposes. In a real application, these would be stored in the database and affect system behavior.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change User Role</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRoleModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedUser && (
                  <>
                    <p>
                      <strong>User:</strong> {selectedUser.name?.first} {selectedUser.name?.last} 
                      ({selectedUser.email})
                    </p>
                    <p>
                      <strong>Current Role:</strong> 
                      <span className={`badge ms-2 ${getRoleBadgeClass(selectedUser.role)}`}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </p>
                    <div className="mb-3">
                      <label className="form-label">Select New Role:</label>
                      <select 
                        className="form-select"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                      >
                        <option value="jobseeker">Job Seeker</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="alert alert-warning">
                      <small>
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Changing a user's role will affect their permissions and access to features.
                        {newRole === 'admin' && ' Making someone an admin will give them full system access.'}
                      </small>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleRoleChange}
                  disabled={loading || newRole === selectedUser?.role}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Role'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {userToDelete && (
                  <>
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Warning:</strong> This action cannot be undone!
                    </div>
                    <p>
                      Are you sure you want to delete the following user?
                    </p>
                    <div className="card">
                      <div className="card-body">
                        <p className="mb-1">
                          <strong>Name:</strong> {userToDelete.name?.first} {userToDelete.name?.last}
                        </p>
                        <p className="mb-1">
                          <strong>Email:</strong> {userToDelete.email}
                        </p>
                        <p className="mb-0">
                          <strong>Role:</strong> 
                          <span className={`badge ms-2 ${getRoleBadgeClass(userToDelete.role)}`}>
                            {userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="alert alert-warning mt-3">
                      <small>
                        Deleting this user will permanently remove their account, profile data, and all associated records. 
                        Any jobs posted by this user (if they're a recruiter) and applications will also be affected.
                      </small>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteUser}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sandbox;