import React from 'react';
import JobTypeBadge from '../../../common/ui/JobTypeBadge';

const JobDetailsHeader = ({ job }) => (
  <div className="card shadow-sm border-0 mb-4">
    <div className="card-header bg-primary text-white py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-9">
            <h2 className="mb-0">{job.title}</h2>
            <p className="mb-0 fs-5">{job.company}</p>
          </div>
          <div className="col-md-3 text-md-end mt-3 mt-md-0">
            <JobTypeBadge type={job.jobType} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default JobDetailsHeader;