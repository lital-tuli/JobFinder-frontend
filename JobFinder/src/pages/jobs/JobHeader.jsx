import React from 'react';
import JobTypeBadge from '../../../components/common/ui/JobTypeBadge';

const JobHeader = ({ job }) => (
  <div className="card shadow-sm border-0 mb-4">
    <div className="card-header bg-primary text-white py-3">
      <div className="row align-items-center">
        <div className="col-md-9">
          <h1 className="mb-0 h2">{job.title}</h1>
          <p className="mb-0 fs-5 opacity-90">{job.company}</p>
        </div>
        <div className="col-md-3 text-md-end mt-3 mt-md-0">
          <JobTypeBadge type={job.jobType} size="lg" />
        </div>
      </div>
    </div>
  </div>
);

export default JobHeader;