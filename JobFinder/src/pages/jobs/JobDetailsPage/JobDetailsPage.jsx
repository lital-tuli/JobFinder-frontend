// JobDetailsPage/JobDetailsPage.jsx (Container)
import React from 'react';
import { useJobDetails } from './hooks/useJobDetails';
import JobDetailsHeader from './components/JobDetailsHeader';
import JobDetailsContent from './components/JobDetailsContent';
import JobDetailsActions from './components/JobDetailsActions';
import LoadingSpinner from '../../common/ui/LoadingSpinner';
import ErrorMessage from '../../common/feedback/ErrorMessage';

const JobDetailsPage = () => {
  const { job, loading, error, applicationStatus, handleApply, handleSave } = useJobDetails();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container py-5">
      <JobDetailsHeader job={job} />
      <JobDetailsContent job={job} />
      <JobDetailsActions 
        job={job}
        applicationStatus={applicationStatus}
        onApply={handleApply}
        onSave={handleSave}
      />
    </div>
  );
};

export default JobDetailsPage;