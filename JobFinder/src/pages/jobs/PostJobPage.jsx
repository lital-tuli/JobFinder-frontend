// src/pages/jobs/PostJobPage.jsx - Cleaned version
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
    tags: ''
  });

  const validateForm = () => {
    const errors = {};

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
    }

    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }

    if (!formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    }

    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.salary && isNaN(Number(formData.salary.replace(/[^0-9]/g, '')))) {
      errors.salary = 'Please enter a valid salary';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
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
      const jobData = {
        ...formData,
        salary: formData.salary ? `$${formData.salary}` : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined
      };

      Object.keys(jobData).forEach(key => {
        if (!jobData[key]) {
          delete jobData[key];
        }
      });

      await jobService.createJob(jobData);

      setSuccess('Job posted successfully!');
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
              <h2 className="mb-0">Post a New Job</h2>
            </div>
            <div className="card-body p-4">
              {error && <ErrorMessage error={error} onDismiss={() => setError('')} className="mb-4" />}
              {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} className="mb-4" />}
              <form onSubmit={handleSubmit}>
                <FormField
                  label="Job Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  error={fieldErrors.title}
                  onChange={(value) => handleFieldChange('title', value)}
                  required
                />
                <FormField
                  label="Company"
                  name="company"
                  type="text"
                  value={formData.company}
                  error={fieldErrors.company}
                  onChange={(value) => handleFieldChange('company', value)}
                  required
                />
                <FormField
                  label="Location"
                  name="location"
                  type="text"
                  value={formData.location}
                  error={fieldErrors.location}
                  onChange={(value) => handleFieldChange('location', value)}
                  required
                />
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
                <FormField
                  label="Salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  error={fieldErrors.salary}
                  onChange={(value) => handleFieldChange('salary', value)}
                />
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  error={fieldErrors.description}
                  onChange={(value) => handleFieldChange('description', value)}
                  required
                />
                <FormField
                  label="Requirements"
                  name="requirements"
                  type="textarea"
                  value={formData.requirements}
                  error={fieldErrors.requirements}
                  onChange={(value) => handleFieldChange('requirements', value)}
                  required
                />
                <FormField
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  error={fieldErrors.contactEmail}
                  onChange={(value) => handleFieldChange('contactEmail', value)}
                  required
                />
                <FormField
                  label="Tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  error={fieldErrors.tags}
                  onChange={(value) => handleFieldChange('tags', value)}
                />
                <div className="d-flex justify-content-end mt-4">
                  <button type="button" className="btn btn-secondary me-3" onClick={clearForm} disabled={loading}>
                    Clear
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Job'}
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
