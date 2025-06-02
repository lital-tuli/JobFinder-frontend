// src/pages/jobs/PostJobPage.jsx - Enhanced with FormField and error handling
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import FormField from '../../components/common/FormField/FormField';
import ErrorMessage from '../../components/common/messages/ErrorMessage';
import SuccessMessage from '../../components/common/messages/SuccessMessage';
import { handleFormErrors } from '../../utils/errorHandler';

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
      // Prepare job data
      const jobData = {
        ...formData,
        // Parse salary if provided
        salary: formData.salary ? `$${formData.salary}` : undefined,
        // Convert tags string to array
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined
      };

      // Remove empty optional fields
      Object.keys(jobData).forEach(key => {
        if (!jobData[key] || jobData[key] === '') {
          delete jobData[key];
        }
      });

      await jobService.createJob(jobData);
      
      setSuccess('Job posted successfully!');
      
      // Redirect after a short delay
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
      
      // Handle validation errors from server
      if (!handleFormErrors(err, setFieldErrors)) {
        setError(err.message || 'Failed to post job. Please try again.');
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
                <h2 className="mb-0">Post a New Job</h2>
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
                </div>
              </div>
            </div>
            
            <div className="card-body p-4">
              {/* Messages */}
              {error && (
                <ErrorMessage 
                  error={error} 
                  onDismiss={() => setError('')}
                  className="mb-4"
                />
              )}
              
              {success && (
                <SuccessMessage 
                  message={success} 
                  onDismiss={() => setSuccess('')}
                  className="mb-4"
                />
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Basic Job Information */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3 text-primary">
                    <i className="bi bi-info-circle me-2"></i>
                    Basic Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Job Title"
                        name="title"
                        type="text"
                        value={formData.title}
                        error={fieldErrors.title}
                        onChange={(value) => handleFieldChange('title', value)}
                        placeholder="e.g., Senior Frontend Developer"
                        required
                        helpText="Be specific about the role and seniority level"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Company Name"
                        name="company"
                        type="text"
                        value={formData.company}
                        error={fieldErrors.company}
                        onChange={(value) => handleFieldChange('company', value)}
                        placeholder="e.g., TechCorp Inc."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Location"
                        name="location"
                        type="text"
                        value={formData.location}
                        error={fieldErrors.location}
                        onChange={(value) => handleFieldChange('location', value)}
                        placeholder="e.g., New York, NY or Remote"
                        required
                        helpText="Include 'Remote' if the position allows remote work"
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
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </FormField>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Salary Range"
                        name="salary"
                        type="text"
                        value={formData.salary}
                        error={fieldErrors.salary}
                        onChange={(value) => handleFieldChange('salary', value)}
                        placeholder="e.g., 80,000 - 120,000"
                        helpText="Optional - helps attract qualified candidates"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Experience Level"
                        name="experienceLevel"
                        type="select"
                        value={formData.experienceLevel}
                        error={fieldErrors.experienceLevel}
                        onChange={(value) => handleFieldChange('experienceLevel', value)}
                      >
                        <option value="">Select experience level</option>
                        <option value="Entry Level">Entry Level (0-2 years)</option>
                        <option value="Mid Level">Mid Level (3-5 years)</option>
                        <option value="Senior Level">Senior Level (6+ years)</option>
                        <option value="Executive">Executive</option>
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
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
                      error={fieldErrors.description}
                      onChange={(value) => handleFieldChange('description', value)}
                      placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                      required
                      rows={6}
                      helpText={`${formData.description.length}/2000 characters`}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <FormField
                      label="Requirements"
                      name="requirements"
                      type="textarea"
                      value={formData.requirements}
                      error={fieldErrors.requirements}
                      onChange={(value) => handleFieldChange('requirements', value)}
                      placeholder="List the skills, experience, and qualifications required for this position..."
                      required
                      rows={6}
                      helpText={`${formData.requirements.length}/2000 characters`}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <FormField
                      label="Benefits & Perks"
                      name="benefits"
                      type="textarea"
                      value={formData.benefits}
                      error={fieldErrors.benefits}
                      onChange={(value) => handleFieldChange('benefits', value)}
                      placeholder="Health insurance, flexible hours, remote work options, professional development..."
                      rows={3}
                      helpText="Optional - highlight what makes your company attractive"
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
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        error={fieldErrors.tags}
                        onChange={(value) => handleFieldChange('tags', value)}
                        placeholder="React, JavaScript, Remote, Startup"
                        helpText="Comma-separated keywords to help with discovery"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/my-listings')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Posting Job...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Post Job
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="mt-4">
            <div className="card bg-light border-0">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">
                  <i className="bi bi-lightbulb text-warning me-2"></i>
                  Tips for Writing Effective Job Posts
                </h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h6 className="fw-semibold">Be Specific</h6>
                    <p className="text-muted small mb-0">
                      Use clear, specific job titles and detailed descriptions to attract the right candidates.
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="fw-semibold">Include Salary</h6>
                    <p className="text-muted small mb-0">
                      Posts with salary ranges get 30% more qualified applications.
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h6 className="fw-semibold">Highlight Benefits</h6>
                    <p className="text-muted small mb-0">
                      Mention unique benefits and company culture to stand out from competitors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;