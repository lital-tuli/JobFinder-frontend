// src/pages/PostJobPage.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';

const PostJobPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validation schema
  const jobSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title cannot exceed 100 characters')
      .required('Title is required'),
    company: Yup.string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name cannot exceed 100 characters')
      .required('Company name is required'),
    location: Yup.string()
      .min(2, 'Location must be at least 2 characters')
      .max(100, 'Location cannot exceed 100 characters')
      .required('Location is required'),
    jobType: Yup.string()
      .oneOf(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], 'Invalid job type')
      .required('Job type is required'),
    salary: Yup.string()
      .matches(/^(\$\d{1,3}(,\d{3})*(\.\d+)?\s*(-|to)\s*\$\d{1,3}(,\d{3})*(\.\d+)?)$|^(\$\d{1,3}(,\d{3})*(\.\d+)?)$/, 'Please enter a valid salary format (e.g., $50,000 or $50,000 - $70,000)')
      .nullable(),
    description: Yup.string()
      .min(50, 'Description must be at least 50 characters')
      .max(2000, 'Description cannot exceed 2000 characters')
      .required('Description is required'),
    requirements: Yup.string()
      .min(50, 'Requirements must be at least 50 characters')
      .max(2000, 'Requirements cannot exceed 2000 characters')
      .required('Requirements are required'),
    contactEmail: Yup.string()
      .email('Invalid email format')
      .required('Contact email is required')
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      title: '',
      company: '',
      location: '',
      jobType: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      contactEmail: ''
    },
    validationSchema: jobSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        await jobService.createJob(values);
        navigate('/my-listings', { state: { success: true, message: 'Job posted successfully!' } });
      } catch (err) {
        setError(err.error || 'Failed to post job. Please try again.');
        setLoading(false);
      }
    }
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="mb-0 text-center">Post a New Job</h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Job Title*</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    placeholder="e.g., Frontend Developer"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="invalid-feedback">{formik.errors.title}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="company" className="form-label">Company Name*</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.company && formik.errors.company ? 'is-invalid' : ''}`}
                    id="company"
                    name="company"
                    placeholder="e.g., Acme Inc."
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.company && formik.errors.company && (
                    <div className="invalid-feedback">{formik.errors.company}</div>
                  )}
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="location" className="form-label">Location*</label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.location && formik.errors.location ? 'is-invalid' : ''}`}
                      id="location"
                      name="location"
                      placeholder="e.g., New York, NY or Remote"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.location && formik.errors.location && (
                      <div className="invalid-feedback">{formik.errors.location}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="jobType" className="form-label">Job Type*</label>
                    <select
                      className={`form-select ${formik.touched.jobType && formik.errors.jobType ? 'is-invalid' : ''}`}
                      id="jobType"
                      name="jobType"
                      value={formik.values.jobType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                    {formik.touched.jobType && formik.errors.jobType && (
                      <div className="invalid-feedback">{formik.errors.jobType}</div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">Salary (Optional)</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.salary && formik.errors.salary ? 'is-invalid' : ''}`}
                    id="salary"
                    name="salary"
                    placeholder="e.g., $50,000 - $70,000"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.salary && formik.errors.salary && (
                    <div className="invalid-feedback">{formik.errors.salary}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Job Description*</label>
                  <textarea
                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">{formik.errors.description}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="requirements" className="form-label">Requirements*</label>
                  <textarea
                    className={`form-control ${formik.touched.requirements && formik.errors.requirements ? 'is-invalid' : ''}`}
                    id="requirements"
                    name="requirements"
                    rows="6"
                    placeholder="List the skills, experience, and qualifications required for this position..."
                    value={formik.values.requirements}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                  {formik.touched.requirements && formik.errors.requirements && (
                    <div className="invalid-feedback">{formik.errors.requirements}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="form-label">Contact Email*</label>
                  <input
                    type="email"
                    className={`form-control ${formik.touched.contactEmail && formik.errors.contactEmail ? 'is-invalid' : ''}`}
                    id="contactEmail"
                    name="contactEmail"
                    placeholder="e.g., jobs@example.com"
                    value={formik.values.contactEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contactEmail && formik.errors.contactEmail && (
                    <div className="invalid-feedback">{formik.errors.contactEmail}</div>
                  )}
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Posting Job...
                      </>
                    ) : (
                      'Post Job'
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