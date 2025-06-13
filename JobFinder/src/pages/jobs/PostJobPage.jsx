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
    // Additional fields
    companyWebsite: '',
    applicationDeadline: '',
    experienceLevel: '',
    benefits: '',
    tags: ''
  });

  // Enhanced validation
  const validateForm = () => {
    const errors = {};

    // Required field validations
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    } else if (formData.title.length < 2) {
      errors.title = 'Job title must be at least 2 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Job title cannot exceed 100 characters';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    } else if (formData.company.length < 2) {
      errors.company = 'Company name must be at least 2 characters';
    } else if (formData.company.length > 100) {
      errors.company = 'Company name cannot exceed 100 characters';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (formData.location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    }

    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
    }

    if (!formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    } else if (formData.requirements.length < 10) {
      errors.requirements = 'Requirements must be at least 10 characters';
    } else if (formData.requirements.length > 2000) {
      errors.requirements = 'Requirements cannot exceed 2000 characters';
    }

    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    // Optional field validations
    if (formData.salary && isNaN(Number(formData.salary.replace(/[^0-9]/g, '')))) {
      errors.salary = 'Please enter a valid salary';
    }

    if (formData.companyWebsite && !/^https?:\/\/.+/.test(formData.companyWebsite)) {
      errors.companyWebsite = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      const today = new Date();
      if (deadline <= today) {
        errors.applicationDeadline = 'Application deadline must be in the future';
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
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      jobType: formData.jobType,
      contactEmail: formData.contactEmail,
      // Only include salary if it has a value
      ...(formData.salary && { salary: formData.salary })
    };

    console.log('Sending job data to backend:', jobData);

    const response = await jobService.createJob(jobData);
    
    setSuccess('Job posted successfully!');
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/my-listings', { 
        state: { 
          message: 'Job posted successfully!', 
          newJobId: response.data?._id 
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
      contactEmail: '',
      companyWebsite: '',
      applicationDeadline: '',
      experienceLevel: '',
      benefits: '',
      tags: ''
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
                      onChange={(value) => handleFieldChange('title', value)}
                      error={fieldErrors.title}
                      required
                      placeholder="e.g., Senior Frontend Developer"
                      maxLength={100}
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
                      onChange={(value) => handleFieldChange('company', value)}
                      error={fieldErrors.company}
                      required
                      placeholder="e.g., Tech Solutions Inc."
                      maxLength={100}
                      disabled={loading}
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={(value) => handleFieldChange('location', value)}
                      error={fieldErrors.location}
                      required
                      placeholder="e.g., Tel Aviv, Israel"
                      maxLength={100}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Salary and Experience Level */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Salary Range"
                      name="salary"
                      type="text"
                      value={formData.salary}
                      onChange={(value) => handleFieldChange('salary', value)}
                      error={fieldErrors.salary}
                      placeholder="e.g., 80,000 - 120,000"
                      helpText="Optional - you can specify a range or leave blank"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormField
                      label="Experience Level"
                      name="experienceLevel"
                      type="select"
                      value={formData.experienceLevel}
                      onChange={(value) => handleFieldChange('experienceLevel', value)}
                      error={fieldErrors.experienceLevel}
                      disabled={loading}
                      placeholder="Select experience level"
                    >
                      <option value="">Select level (optional)</option>
                      <option value="Entry Level">Entry Level (0-2 years)</option>
                      <option value="Mid Level">Mid Level (2-5 years)</option>
                      <option value="Senior Level">Senior Level (5-8 years)</option>
                      <option value="Lead Level">Lead Level (8+ years)</option>
                      <option value="Executive">Executive</option>
                    </FormField>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3 text-primary">
                    <i className="bi bi-file-text me-2"></i>
                    Job Details
                  </h5>
                  
                  <div className="mb-3">
                    <FormField
                      label="Job Description"
                      name="description"
                      type="textarea"
                      value={formData.description}
                      onChange={(value) => handleFieldChange('description', value)}
                      error={fieldErrors.description}
                      required
                      rows={6}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                      helpText="Provide a detailed description of the job"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <FormField
                      label="Requirements & Qualifications"
                      name="requirements"
                      type="textarea"
                      value={formData.requirements}
                      onChange={(value) => handleFieldChange('requirements', value)}
                      error={fieldErrors.requirements}
                      required
                      rows={5}
                      placeholder="List the required skills, experience, education, and qualifications..."
                      helpText="Be specific about must-have vs nice-to-have qualifications"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <FormField
                      label="Benefits & Perks"
                      name="benefits"
                      type="textarea"
                      value={formData.benefits}
                      onChange={(value) => handleFieldChange('benefits', value)}
                      error={fieldErrors.benefits}
                      rows={4}
                      placeholder="Health insurance, flexible hours, remote work, professional development..."
                      helpText="Optional - highlight what makes your company attractive"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Contact & Additional Info */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3 text-primary">
                    <i className="bi bi-envelope me-2"></i>
                    Contact & Additional Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Contact Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        error={fieldErrors.contactEmail}
                        onChange={(value) => handleFieldChange('contactEmail', value)}
                        placeholder="jobs@company.com"
                        required
                        helpText="Where candidates should send applications"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Company Website"
                        name="companyWebsite"
                        type="url"
                        value={formData.companyWebsite}
                        error={fieldErrors.companyWebsite}
                        onChange={(value) => handleFieldChange('companyWebsite', value)}
                        placeholder="https://www.company.com"
                        helpText="Optional - helps candidates learn about your company"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Application Deadline"
                        name="applicationDeadline"
                        type="date"
                        value={formData.applicationDeadline}
                        error={fieldErrors.applicationDeadline}
                        onChange={(value) => handleFieldChange('applicationDeadline', value)}
                        helpText="Optional - when applications close"
                        disabled={loading}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={(value) => handleFieldChange('tags', value)}
                        placeholder="React, JavaScript, Remote, Full-time"
                        helpText="Optional - comma-separated keywords for better search"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;