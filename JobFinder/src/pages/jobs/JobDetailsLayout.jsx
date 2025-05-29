
import React from 'react';
import JobHeader from './JobHeader';
import JobContent from './JobContent';
import JobActions from './JobActions';

const JobDetailsLayout = ({ job, applicationStatus, handleApply, handleSave }) => (
  <div className="container py-5">
    <JobHeader job={job} />
    <JobContent job={job} />
    <JobActions 
      job={job}
      applicationStatus={applicationStatus}
      onApply={handleApply}
      onSave={handleSave}
    />
  </div>
);

export default JobDetailsLayout;