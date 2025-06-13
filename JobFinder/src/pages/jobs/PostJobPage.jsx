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
    title: '',           // Required: min 2, max 256
    company: '',         // Required: min 2, max 256  
    location: '',        // Required: min 2, max 256
    jobType: 'Full-time', // Required: one of ["Full-time", "Part-time", "Contract", "Internship", "Remote"]
    salary: '',          // Optional: string
    description: '',     // Required: min 2, max 1024
    requirements: '',    // Required: min 2, max 1024
    contactEmail: '',    // Required: valid email
    // Note: postedBy, applicants, isActive are handled by backend
    // Removed: tags field (was causing 400 error)
  });

  const validateForm = () => {
    const errors = {};

    // Title validation (matches backend: min 2, max 256, required)
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      errors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 256) {
      errors.title = 'Title cannot exceed 256 characters';
    }

    // Company validation (matches backend: min 2, max 256, required)
    if (!formData.company || !formData.company.trim()) {
      errors.company = 'Company name is required';
    } else if (formData.company.trim().length < 2) {
      errors.company = 'Company name must be at least 2 characters';
    } else if (formData.company.trim().length > 256) {
      errors.company = 'Company name cannot exceed 256 characters';
    }

    // Location validation (matches backend: min 2, max 256, required)
    if (!formData.location || !formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (formData.location.trim().length > 256) {
      errors.location = 'Location cannot exceed 256 characters';
    }

    // Description validation (matches backend: min 2, max 1024, required)
    if (!formData.description || !formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 2) {
      errors.description = 'Description must be at least 2 characters';
    } else if (formData.description.trim().length > 1024) {
      errors.description = 'Description cannot exceed 1024 characters';
    }

    // Requirements validation (matches backend: min 2, max 1024, required)
    if (!formData.requirements || !formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    } else if (formData.requirements.trim().length < 2) {
      errors.requirements = 'Requirements must be at least 2 characters';
    } else if (formData.requirements.trim().length > 1024) {
      errors.requirements = 'Requirements cannot exceed 1024 characters';
    }

    // Job type validation (matches backend enum exactly)
    const validJobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    } else if (!validJobTypes.includes(formData.jobType)) {
      errors.jobType = 'Job type must be one of: Full-time, Part-time, Contract, Internship, Remote';
    }

    // Contact email validation (matches backend pattern)
    if (!formData.contactEmail || !formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else {
      // Use same regex as backend validation
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.contactEmail.trim())) {
        errors.contactEmail = 'Please provide a valid email address';
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

  // ✅ FIXED: Submit handler with proper data formatting
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
      // ✅ FIXED: Send only the fields that backend expects, with proper formatting
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        contactEmail: formData.contactEmail.trim().toLowerCase(),
        // Only include salary if it's provided
        ...(formData.salary.trim() && { salary: formData.salary.trim() })
      };

      console.log('Sending job data:', jobData); // Debug log

      const result = await jobService.createJob(jobData);
      console.log('Job created successfully:', result); // Debug log

      setSuccess('Job posted successfully!');
      
      // Redirect after success
      setTimeout(() => {
        navigate('/my-listings', { 
          state: { 
            success: true, 
            message: 'Job posted successfully!' 
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
                  {/* Job Title */}
                  <div className="col-md-8 mb-3">
                    <FormField
                      id="title"
                      label="Job Title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      error={fieldErrors.title}
                      required
                      placeholder="e.g., Senior Frontend Developer"
                      maxLength={256}
                      disabled={loading}
                    />
                  </div>

                  {/* Job Type */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="jobType" className="form-label">
                      Job Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      className={`form-select ${fieldErrors.jobType ? 'is-invalid' : ''}`}
                      value={formData.jobType}
                      onChange={(e) => handleFieldChange('jobType', e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                    {fieldErrors.jobType && (
                      <div className="invalid-feedback">{fieldErrors.jobType}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Company */}
                  <div className="col-md-6 mb-3">
                    <FormField
                      id="company"
                      label="Company Name"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleFieldChange('company', e.target.value)}
                      error={fieldErrors.company}
                      required
                      placeholder="e.g., Tech Solutions Inc."
                      maxLength={256}
                      disabled={loading}
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-6 mb-3">
                    <FormField
                      id="location"
                      label="Location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      error={fieldErrors.location}
                      required
                      placeholder="e.g., Tel Aviv, Israel"
                      maxLength={256}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="row">
                  {/* Salary */}
                  <div className="col-md-6 mb-3">
                    <FormField
                      id="salary"
                      label="Salary (Optional)"
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleFieldChange('salary', e.target.value)}
                      error={fieldErrors.salary}
                      placeholder="e.g., $80,000 - $100,000"
                      disabled={loading}
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="col-md-6 mb-3">
                    <FormField
                      id="contactEmail"
                      label="Contact Email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                      error={fieldErrors.contactEmail}
                      required
                      placeholder="jobs@company.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Job Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className={`form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
                    rows="4"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    required
                    maxLength={1024}
                    disabled={loading}
                  />
                  <div className="form-text">
                    {formData.description.length}/1024 characters
                  </div>
                  {fieldErrors.description && (
                    <div className="invalid-feedback">{fieldErrors.description}</div>
                  )}
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <label htmlFor="requirements" className="form-label">
                    Requirements <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    className={`form-control ${fieldErrors.requirements ? 'is-invalid' : ''}`}
                    rows="4"
                    value={formData.requirements}
                    onChange={(e) => handleFieldChange('requirements', e.target.value)}
                    placeholder="List the skills, experience, and qualifications required for this position..."
                    required
                    maxLength={1024}
                    disabled={loading}
                  />
                  <div className="form-text">
                    {formData.requirements.length}/1024 characters
                  </div>
                  {fieldErrors.requirements && (
                    <div className="invalid-feedback">{fieldErrors.requirements}</div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/my-listings')}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Cancel
                  </button>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={clearForm}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Clear
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Posting Job...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle me-1"></i>
                          Post Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Help Section */}
            <div className="card-footer bg-light">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                <strong>Tips:</strong> Write a clear, detailed job description to attract the best candidates. 
                Include specific requirements and highlight what makes your company a great place to work.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;