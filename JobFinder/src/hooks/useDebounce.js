import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized job card component
import React, { memo } from 'react';

const JobCard = memo(({ job, onApply }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <div className="job-meta">
        <span>{job.jobType}</span>
        <span>{job.workLocation}</span>
        <span>{job.experienceLevel}</span>
      </div>
      <button onClick={() => onApply(job._id)}>
        Apply Now
      </button>
    </div>
  );
});