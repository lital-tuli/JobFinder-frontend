import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ job }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{job.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
        <p className="card-text">{job.location}</p>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
