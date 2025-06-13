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

  // ✅ FIXED: Form data structure matches backend validation exactly
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
  });

  // ✅ FIXED: Validation exactly matching backend Joi schema
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
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to post job. Please try again.');
      }

      // Handle field-specific errors if available
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
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
              <h2 className="mb-0">Post a New Job</h2>
            </div>
            <div className="card-body p-4">
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
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Job Title"
                      name="title"
                      type="text"
                      value={formData.title}
                      error={fieldErrors.title}
                      onChange={(value) => handleFieldChange('title', value)}
                      placeholder="e.g. Senior React Developer"
                      required
                      maxLength={256}
                      helpText={`${formData.title.length}/256 characters`}
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Company"
                      name="company"
                      type="text"
                      value={formData.company}
                      error={fieldErrors.company}
                      onChange={(value) => handleFieldChange('company', value)}
                      placeholder="e.g. TechCorp Inc."
                      required
                      maxLength={256}
                      helpText={`${formData.company.length}/256 characters`}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Location"
                      name="location"
                      type="text"
                      value={formData.location}
                      error={fieldErrors.location}
                      onChange={(value) => handleFieldChange('location', value)}
                      placeholder="e.g. Tel Aviv, Israel"
                      required
                      maxLength={256}
                      helpText={`${formData.location.length}/256 characters`}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Job Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${fieldErrors.jobType ? 'is-invalid' : ''}`}
                        value={formData.jobType}
                        onChange={(e) => handleFieldChange('jobType', e.target.value)}
                        required
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
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Salary (Optional)"
                      name="salary"
                      type="text"
                      value={formData.salary}
                      error={fieldErrors.salary}
                      onChange={(value) => handleFieldChange('salary', value)}
                      placeholder="e.g. $50,000 - $70,000"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      error={fieldErrors.contactEmail}
                      onChange={(value) => handleFieldChange('contactEmail', value)}
                      placeholder="hiring@company.com"
                      required
                    />
                  </div>
                </div>

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
                  maxLength={1024}
                  helpText={`${formData.description.length}/1024 characters`}
                />

                <FormField
                  label="Requirements"
                  name="requirements"
                  type="textarea"
                  value={formData.requirements}
                  error={fieldErrors.requirements}
                  onChange={(value) => handleFieldChange('requirements', value)}
                  placeholder="List the skills, experience, and qualifications required..."
                  required
                  rows={6}
                  maxLength={1024}
                  helpText={`${formData.requirements.length}/1024 characters`}
                />

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
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
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;