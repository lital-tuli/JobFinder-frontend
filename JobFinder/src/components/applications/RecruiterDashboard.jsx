import { useState } from 'react';
import axios from 'axios';

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchApplications = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, notes = '') => {
    try {
      await axios.patch(`/api/applications/${applicationId}/status`, {
        status,
        notes
      });
      
      // Refresh applications
      if (selectedJob) {
        fetchApplications(selectedJob);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <div className="recruiter-dashboard">
      <h2>Manage Applications</h2>
      
      <div className="job-selector">
        <select 
          value={selectedJob} 
          onChange={(e) => {
            setSelectedJob(e.target.value);
            if (e.target.value) fetchApplications(e.target.value);
          }}
        >
          <option value="">Select a job</option>
          {/* Populate with user's jobs */}
        </select>
      </div>

      {loading ? (
        <div>Loading applications...</div>
      ) : (
        <div className="applications-list">
          {applications.map(application => (
            <div key={application._id} className="application-card">
              <div className="applicant-info">
                <h4>{application.applicantId.name}</h4>
                <p>{application.applicantId.email}</p>
                <p>Applied: {new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
              
              <div className="status-section">
                <span className={`status ${application.status}`}>
                  {application.status}
                </span>
                
                <select 
                  value={application.status}
                  onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="actions">
                {application.resumeUrl && (
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;