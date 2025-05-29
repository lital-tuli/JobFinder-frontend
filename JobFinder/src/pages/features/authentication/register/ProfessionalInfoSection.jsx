// src/pages/features/authentication/register/ProfessionalInfoSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../../components/common/FormField/FormField';

const ProfessionalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  showCompanyInfo = false,
  showSkills = false,
  showExperience = false,
  showSalaryExpectations = false,
  className = '' 
}) => {
  // Predefined industry options
  const industries = [
    'Technology & Software',
    'Healthcare & Medical',
    'Finance & Banking',
    'Education & Training',
    'Marketing & Advertising',
    'Sales & Business Development',
    'Manufacturing & Production',
    'Retail & E-commerce',
    'Real Estate',
    'Consulting',
    'Legal & Law',
    'Media & Communications',
    'Non-profit & NGO',
    'Government & Public Sector',
    'Hospitality & Tourism',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Construction & Engineering',
    'Arts & Creative',
    'Other'
  ];

  // Experience level options
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'junior', label: 'Junior (2-4 years)' },
    { value: 'mid', label: 'Mid-Level (4-7 years)' },
    { value: 'senior', label: 'Senior (7-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
    { value: 'executive', label: 'Executive/C-Level' },
    { value: 'student', label: 'Student/Recent Graduate' }
  ];

  // Job types
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote',
    'Hybrid'
  ];

  return (
    <div className={`professional-info-section ${className}`}>
      <div className="section-header mb-4">
        <h5 className="fw-semibold mb-2 d-flex align-items-center">
          <i className="bi bi-briefcase me-2 text-primary"></i>
          Professional Information
        </h5>
        <p className="text-muted small mb-0">
          Help us understand your career background and goals
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <FormField
          label="I am a"
          name="role"
          type="select"
          value={formData.role || ''}
          error={errors.role}
          onChange={(value) => onChange('role', value)}
          required
        >
          <option value="">Select your role</option>
          <option value="jobseeker">Job Seeker - Looking for opportunities</option>
          <option value="recruiter">Recruiter/Employer - Posting jobs</option>
        </FormField>
      </div>

      {/* Current Position/Title and Company */}
      <div className="row">
        <div className={showCompanyInfo ? "col-md-6 mb-3" : "col-md-12 mb-3"}>
          <FormField
            label="Current Job Title / Profession"
            name="profession"
            type="text"
            value={formData.profession || ''}
            error={errors.profession}
            onChange={(value) => onChange('profession', value)}
            placeholder="e.g., Software Engineer, Marketing Manager"
            helpText="What's your current or most recent position?"
          />
        </div>

        {/* Company Name */}
        {showCompanyInfo && (
          <div className="col-md-6 mb-3">
            <FormField
              label="Company Name"
              name="companyName"
              type="text"
              value={formData.companyName || ''}
              error={errors.companyName}
              onChange={(value) => onChange('companyName', value)}
              placeholder="Your current or most recent company"
            />
          </div>
        )}
      </div>

      {/* Industry and Experience Level */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <FormField
            label="Industry"
            name="industry"
            type="select"
            value={formData.industry || ''}
            error={errors.industry}
            onChange={(value) => onChange('industry', value)}
            helpText="What industry do you work in?"
          >
            <option value="">Select your industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </FormField>
        </div>

        {/* Experience Level */}
        {showExperience && (
          <div className="col-md-6 mb-3">
            <FormField
              label="Experience Level"
              name="experienceLevel"
              type="select"
              value={formData.experienceLevel || ''}
              error={errors.experienceLevel}
              onChange={(value) => onChange('experienceLevel', value)}
            >
              <option value="">Select your experience level</option>
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </FormField>
          </div>
        )}
      </div>

      {/* Bio/Professional Summary */}
      <div className="mb-4">
        <FormField
          label="Professional Summary"
          name="bio"
          type="textarea"
          value={formData.bio || ''}
          error={errors.bio}
          onChange={(value) => onChange('bio', value)}
          placeholder="Describe your professional background, key achievements, and career goals..."
          helpText={`${(formData.bio || '').length}/500 characters`}
          rows={4}
        />
      </div>

      {/* Job Preferences (for job seekers) */}
      {formData.role === 'jobseeker' && (
        <div className="border-top pt-4 mt-4">
          <h6 className="fw-semibold mb-3 d-flex align-items-center">
            <i className="bi bi-gear me-2 text-secondary"></i>
            Job Preferences
          </h6>
          
          <div className="row">
            {/* Preferred Job Types */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Preferred Job Types</label>
              <div className="job-type-checkboxes bg-light p-3 rounded">
                {jobTypes.map(type => (
                  <FormField
                    key={type}
                    name={`jobTypes.${type}`}
                    type="checkbox"
                    value={formData.jobTypes?.[type] || false}
                    onChange={(value) => onChange(`jobTypes.${type}`, value)}
                    label={type}
                    className="mb-2"
                  />
                ))}
              </div>
            </div>

            {/* Preferred Location */}
            <div className="col-md-6 mb-3">
              <FormField
                label="Preferred Work Location"
                name="preferredLocation"
                type="text"
                value={formData.preferredLocation || ''}
                error={errors.preferredLocation}
                onChange={(value) => onChange('preferredLocation', value)}
                placeholder="City, State or Remote"
                helpText="Where would you like to work?"
              />
            </div>
          </div>

          {/* Salary Expectations */}
          {showSalaryExpectations && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <FormField
                  label="Minimum Salary Expectation"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin || ''}
                  error={errors.salaryMin}
                  onChange={(value) => onChange('salaryMin', value)}
                  placeholder="50000"
                  helpText="Annual salary in USD"
                />
              </div>
              <div className="col-md-6 mb-3">
                <FormField
                  label="Maximum Salary Expectation"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax || ''}
                  error={errors.salaryMax}
                  onChange={(value) => onChange('salaryMax', value)}
                  placeholder="80000"
                  helpText="Annual salary in USD"
                />
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Available to Start"
                name="availabilityDate"
                type="date"
                value={formData.availabilityDate || ''}
                error={errors.availabilityDate}
                onChange={(value) => onChange('availabilityDate', value)}
                helpText="When can you start a new position?"
              />
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                name="immediateAvailability"
                type="checkbox"
                value={formData.immediateAvailability || false}
                onChange={(value) => onChange('immediateAvailability', value)}
                label="Available immediately"
                className="mt-4 pt-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      {showSkills && (
        <div className="border-top pt-4 mt-4">
          <h6 className="fw-semibold mb-3 d-flex align-items-center">
            <i className="bi bi-tools me-2 text-secondary"></i>
            Skills & Expertise
          </h6>
          
          <FormField
            label="Key Skills"
            name="skills"
            type="textarea"
            value={formData.skills || ''}
            error={errors.skills}
            onChange={(value) => onChange('skills', value)}
            placeholder="List your key skills separated by commas (e.g., JavaScript, React, Node.js, Project Management)"
            helpText="Enter skills relevant to your profession"
            rows={3}
          />
        </div>
      )}

      {/* Company-specific fields for recruiters */}
      {formData.role === 'recruiter' && (
        <div className="border-top pt-4 mt-4">
          <h6 className="fw-semibold mb-3 d-flex align-items-center">
            <i className="bi bi-building me-2 text-secondary"></i>
            Company Information
          </h6>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Company Size"
                name="companySize"
                type="select"
                value={formData.companySize || ''}
                error={errors.companySize}
                onChange={(value) => onChange('companySize', value)}
              >
                <option value="">Select company size</option>
                <option value="startup">Startup (1-10 employees)</option>
                <option value="small">Small (11-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201-1000 employees)</option>
                <option value="enterprise">Enterprise (1000+ employees)</option>
              </FormField>
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                label="Company Website"
                name="companyWebsite"
                type="url"
                value={formData.companyWebsite || ''}
                error={errors.companyWebsite}
                onChange={(value) => onChange('companyWebsite', value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          <FormField
            label="Typical Hiring Timeline"
            name="hiringTimeline"
            type="select"
            value={formData.hiringTimeline || ''}
            error={errors.hiringTimeline}
            onChange={(value) => onChange('hiringTimeline', value)}
            helpText="How long does your hiring process typically take?"
          >
            <option value="">Select timeline</option>
            <option value="1-week">1 Week</option>
            <option value="2-weeks">2 Weeks</option>
            <option value="1-month">1 Month</option>
            <option value="2-months">2 Months</option>
            <option value="3-months">3+ Months</option>
          </FormField>
        </div>
      )}
    </div>
  );
};

ProfessionalInfoSection.propTypes = {
  formData: PropTypes.shape({
    role: PropTypes.string,
    profession: PropTypes.string,
    companyName: PropTypes.string,
    industry: PropTypes.string,
    experienceLevel: PropTypes.string,
    bio: PropTypes.string,
    jobTypes: PropTypes.object,
    preferredLocation: PropTypes.string,
    salaryMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salaryMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availabilityDate: PropTypes.string,
    immediateAvailability: PropTypes.bool,
    skills: PropTypes.string,
    companySize: PropTypes.string,
    companyWebsite: PropTypes.string,
    hiringTimeline: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showCompanyInfo: PropTypes.bool,
  showSkills: PropTypes.bool,
  showExperience: PropTypes.bool,
  showSalaryExpectations: PropTypes.bool,
  className: PropTypes.string,
};

export default ProfessionalInfoSection;