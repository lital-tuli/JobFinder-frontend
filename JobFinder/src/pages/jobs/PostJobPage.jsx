import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import FormField from '../../components/common/FormField/FormField';
import ErrorMessage from '../../components/common/messages/ErrorMessage';
import SuccessMessage from '../../components/common/messages/SuccessMessage';

const PostJobPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    contactEmail: '',
    // Note: Additional fields removed as they're not supported by backend
    // companyWebsite: '',
    // applicationDeadline: '',
    // experienceLevel: '',
    // benefits: '',
    // tags: ''
  });

  // Enhanced validation
  const validateForm = () => {
    const errors = {};

    // Required field validations
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    } else if (formData.title.length < 2) {
      errors.title = 'Job title must be at least 2 characters';
    } else if (formData.title.length > 256) {
      errors.title = 'Job title cannot exceed 256 characters';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    } else if (formData.company.length < 2) {
      errors.company = 'Company name must be at least 2 characters';
    } else if (formData.company.length > 256) {
      errors.company = 'Company name cannot exceed 256 characters';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (formData.location.length > 256) {
      errors.location = 'Location cannot exceed 256 characters';
    }

    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    } else if (formData.description.length < 2) {
      errors.description = 'Description must be at least 2 characters';
    } else if (formData.description.length > 1024) {
      errors.description = 'Description cannot exceed 1024 characters';
    }

    if (!formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    } else if (formData.requirements.length < 2) {
      errors.requirements = 'Requirements must be at least 2 characters';
    } else if (formData.requirements.length > 1024) {
      errors.requirements = 'Requirements cannot exceed 1024 characters';
    }

    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    // Optional salary validation
    if (formData.salary && formData.salary.trim()) {
      // Allow formats like: 50000, $50000, 50k, $50k, 50000-70000, etc.
      const salaryPattern = /^[$]?[\d,]+(k|K)?(\s*-\s*[$]?[\d,]+(k|K)?)?$/;
      if (!salaryPattern.test(formData.salary.replace(/\s/g, ''))) {
        errors.salary = 'Please enter a valid salary format (e.g., 50000, $50k, 50000-70000)';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors above before submitting');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // ✅ FIXED: Only send fields that are allowed by the backend validation schema
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        contactEmail: formData.contactEmail.trim(),
        // Only include salary if it has a value
        ...(formData.salary && formData.salary.trim() && { salary: formData.salary.trim() })
      };

      console.log('Sending job data to backend:', jobData);

      // ✅ FIXED: Use createJob instead of postJob
      const response = await jobService.createJob(jobData);
      
      setSuccess('Job posted successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/my-listings', { 
          state: { 
            message: 'Job posted successfully!', 
            newJobId: response._id || response.data?._id 
          } 
        });
      }, 1500);
      
    } catch (err) {
      console.error('Failed to post job:', err);
      
      // Enhanced error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.error) {
        setError(err.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to post job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      contactEmail: ''
    });
    setFieldErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Post a New Job
                </h2>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-light btn-sm"
                    onClick={clearForm}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Clear Form
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate('/my-listings')}
                    disabled={loading}
                  >
                    <i className="bi bi-list me-1"></i>
                    My Listings
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && <ErrorMessage message={error} />}
              {success && <SuccessMessage message={success} />}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  {/* Basic Job Information */}
                  <div className="col-12 mb-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-briefcase me-2"></i>
                      Basic Job Information
                    </h5>
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Job Title"
                      name="title"
                      value={formData.title}
                      error={fieldErrors.title}
                      onChange={(value) => handleFieldChange('title', value)}
                      placeholder="e.g. Frontend Developer, Marketing Manager"
                      required
                      disabled={loading}
                      helpText={`${formData.title.length}/256 characters`}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      error={fieldErrors.company}
                      onChange={(value) => handleFieldChange('company', value)}
                      placeholder="e.g. TechCorp Inc."
                      required
                      disabled={loading}
                      helpText={`${formData.company.length}/256 characters`}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Location"
                      name="location"
                      value={formData.location}
                      error={fieldErrors.location}
                      onChange={(value) => handleFieldChange('location', value)}
                      placeholder="e.g. Tel Aviv, Israel"
                      required
                      disabled={loading}
                      helpText={`${formData.location.length}/256 characters`}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Job Type"
                      name="jobType"
                      type="select"
                      value={formData.jobType}
                      error={fieldErrors.jobType}
                      onChange={(value) => handleFieldChange('jobType', value)}
                      required
                      disabled={loading}
                      placeholder="Select job type"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </FormField>
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Salary Range (Optional)"
                      name="salary"
                      value={formData.salary}
                      error={fieldErrors.salary}
                      onChange={(value) => handleFieldChange('salary', value)}
                      placeholder="e.g. ₪15,000-₪20,000, $60k-$80k"
                      disabled={loading}
                      helpText="Enter salary range or leave empty"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      error={fieldErrors.contactEmail}
                      onChange={(value) => handleFieldChange('contactEmail', value)}
                      placeholder="hiring@company.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Job Details */}
                  <div className="col-12 mb-4 mt-4">
                    <h5 className="text-primary mb-3">
                      <i className="bi bi-file-text me-2"></i>
                      Job Details
                    </h5>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <FormField
                      label="Job Description"
                      name="description"
                      type="textarea"
                      value={formData.description}
                      error={fieldErrors.description}
                      onChange={(value) => handleFieldChange('description', value)}
                      placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                      required
                      disabled={loading}
                      rows={6}
                      helpText={`${formData.description.length}/1024 characters`}
                    />
                  </div>
                  
                  <div className="col-12 mb-4">
                    <FormField
                      label="Requirements"
                      name="requirements"
                      type="textarea"
                      value={formData.requirements}
                      error={fieldErrors.requirements}
                      onChange={(value) => handleFieldChange('requirements', value)}
                      placeholder="List the skills, experience, and qualifications required for this position..."
                      required
                      disabled={loading}
                      rows={6}
                      helpText={`${formData.requirements.length}/1024 characters`}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/my-listings')}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={clearForm}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Clear Form
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Posting Job...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Post Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Help Information */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-info-circle me-2"></i>
                Tips for a Great Job Posting
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check2 text-success me-2"></i>
                  Write a clear and specific job title
                </li>
                <li className="mb-2">
                  <i className="bi bi-check2 text-success me-2"></i>
                  Include detailed job responsibilities and requirements
                </li>
                <li className="mb-2">
                  <i className="bi bi-check2 text-success me-2"></i>
                  Specify the location clearly (city, country, or remote)
                </li>
                <li className="mb-0">
                  <i className="bi bi-check2 text-success me-2"></i>
                  Provide a professional contact email for applications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;