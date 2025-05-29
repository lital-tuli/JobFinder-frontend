import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';

const ProfessionalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  userType = 'jobseeker', // 'jobseeker', 'recruiter', or 'both'
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
      <div className="section-header mb-3">
        <h5 className="fw-semibold mb-1">
          <i className="bi bi-briefcase me-2 text-primary"></i>
          Professional Information
        </h5>
        <p className="text-muted small mb-0">
          {userType === 'recruiter' 
            ? "Tell us about your company and hiring needs"
            : "Help us understand your career background and goals"
          }
        </p>
      </div>

      {/* Role Selection */}
      {userType === 'both' && (
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
      )}

      {/* Current Position/Title */}
      <div className="row">
        <div className={showCompanyInfo ? "col-md-6 mb-3" : "col-md-12 mb-3"}>
          <FormField
            label={userType === 'recruiter' ? "Your Title/Position" : "Current Job Title"}
            name="jobTitle"
            type="text"
            value={formData.jobTitle || ''}
            error={errors.jobTitle}
            onChange={(value) => onChange('jobTitle', value)}
            placeholder={userType === 'recruiter' ? "e.g., HR Manager, Talent Acquisition" : "e.g., Software Engineer, Marketing Manager"}
            helpText={userType === 'recruiter' ? "What's your role in hiring?" : "What's your current or most recent position?"}
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

      {/* Industry */}
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
      <FormField
        label={userType === 'recruiter' ? "Company Description" : "Professional Summary"}
        name="bio"
        type="textarea"
        value={formData.bio || ''}
        error={errors.bio}
        onChange={(value) => onChange('bio', value)}
        placeholder={
          userType === 'recruiter' 
            ? "Tell job seekers about your company culture, mission, and what makes it a great place to work..."
            : "Describe your professional background, key achievements, and career goals..."
        }
        helpText={`${(formData.bio || '').length}/500 characters`}
        rows={4}
      />

      {/* Job Preferences (for job seekers) */}
      {userType === 'jobseeker' && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Job Preferences</h6>
          
          <div className="row">
            {/* Preferred Job Types */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Preferred Job Types</label>
              <div className="job-type-checkboxes">
                {jobTypes.map(type => (
                  <FormField
                    key={type}
                    name={`jobTypes.${type}`}
                    type="checkbox"
                    value={formData.jobTypes?.[type] || false}
                    onChange={(value) => onChange(`jobTypes.${type}`, value)}
                    label={type}
                    className="mb-1"
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
                className="mt-4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      {showSkills && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Skills & Expertise</h6>
          
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

          {/* Skill Level Indicators */}
          {formData.skillLevels && (
            <div className="mt-3">
              <label className="form-label">Skill Proficiency</label>
              <div className="skill-levels">
                {Object.entries(formData.skillLevels).map(([skill, level]) => (
                  <div key={skill} className="d-flex align-items-center mb-2">
                    <span className="me-3" style={{ minWidth: '120px' }}>{skill}</span>
                    <select
                      className="form-select form-select-sm"
                      value={level}
                      onChange={(e) => onChange(`skillLevels.${skill}`, e.target.value)}
                      style={{ maxWidth: '150px' }}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Education (if applicable) */}
      {'education' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Education</h6>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Highest Education Level"
                name="educationLevel"
                type="select"
                value={formData.educationLevel || ''}
                error={errors.educationLevel}
                onChange={(value) => onChange('educationLevel', value)}
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate/PhD</option>
                <option value="certificate">Professional Certificate</option>
                <option value="bootcamp">Coding Bootcamp</option>
                <option value="other">Other</option>
              </FormField>
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                label="Field of Study"
                name="fieldOfStudy"
                type="text"
                value={formData.fieldOfStudy || ''}
                error={errors.fieldOfStudy}
                onChange={(value) => onChange('fieldOfStudy', value)}
                placeholder="e.g., Computer Science, Business Administration"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Institution"
                name="institution"
                type="text"
                value={formData.institution || ''}
                error={errors.institution}
                onChange={(value) => onChange('institution', value)}
                placeholder="University/College name"
              />
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                label="Graduation Year"
                name="graduationYear"
                type="number"
                value={formData.graduationYear || ''}
                error={errors.graduationYear}
                onChange={(value) => onChange('graduationYear', value)}
                placeholder="2020"
                min="1950"
                max={new Date().getFullYear() + 10}
              />
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      {'certifications' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Certifications & Licenses</h6>
          
          <FormField
            label="Professional Certifications"
            name="certifications"
            type="textarea"
            value={formData.certifications || ''}
            error={errors.certifications}
            onChange={(value) => onChange('certifications', value)}
            placeholder="List relevant certifications, licenses, or professional qualifications"
            helpText="Include certification names, issuing organizations, and dates if applicable"
            rows={3}
          />
        </div>
      )}

      {/* Languages */}
      {'languages' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Languages</h6>
          
          <FormField
            label="Languages Spoken"
            name="languages"
            type="text"
            value={formData.languages || ''}
            error={errors.languages}
            onChange={(value) => onChange('languages', value)}
            placeholder="e.g., English (Native), Spanish (Fluent), French (Conversational)"
            helpText="List languages and proficiency levels"
          />
        </div>
      )}

      {/* Work Authorization (for international candidates) */}
      {'workAuthorization' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Work Authorization</h6>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Work Authorization Status"
                name="workAuthorization"
                type="select"
                value={formData.workAuthorization || ''}
                error={errors.workAuthorization}
                onChange={(value) => onChange('workAuthorization', value)}
              >
                <option value="">Select status</option>
                <option value="citizen">US Citizen</option>
                <option value="permanent-resident">Permanent Resident</option>
                <option value="h1b">H1-B Visa</option>
                <option value="opt">F-1 OPT</option>
                <option value="other-visa">Other Work Visa</option>
                <option value="need-sponsorship">Need Sponsorship</option>
              </FormField>
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                name="willingToRelocate"
                type="checkbox"
                value={formData.willingToRelocate || false}
                onChange={(value) => onChange('willingToRelocate', value)}
                label="Willing to relocate for the right opportunity"
                className="mt-4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio/Links */}
      {'portfolio' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Portfolio & Links</h6>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="Portfolio Website"
                name="portfolioUrl"
                type="url"
                value={formData.portfolioUrl || ''}
                error={errors.portfolioUrl}
                onChange={(value) => onChange('portfolioUrl', value)}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                label="LinkedIn Profile"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl || ''}
                error={errors.linkedinUrl}
                onChange={(value) => onChange('linkedinUrl', value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormField
                label="GitHub Profile"
                name="githubUrl"
                type="url"
                value={formData.githubUrl || ''}
                error={errors.githubUrl}
                onChange={(value) => onChange('githubUrl', value)}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div className="col-md-6 mb-3">
              <FormField
                label="Other Professional Link"
                name="otherUrl"
                type="url"
                value={formData.otherUrl || ''}
                error={errors.otherUrl}
                onChange={(value) => onChange('otherUrl', value)}
                placeholder="https://your-other-profile.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Company-specific fields for recruiters */}
      {userType === 'recruiter' && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Company Information</h6>
          
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
    jobTitle: PropTypes.string,
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
    skillLevels: PropTypes.object,
    educationLevel: PropTypes.string,
    fieldOfStudy: PropTypes.string,
    institution: PropTypes.string,
    graduationYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    certifications: PropTypes.string,
    languages: PropTypes.string,
    workAuthorization: PropTypes.string,
    willingToRelocate: PropTypes.bool,
    portfolioUrl: PropTypes.string,
    linkedinUrl: PropTypes.string,
    githubUrl: PropTypes.string,
    otherUrl: PropTypes.string,
    companySize: PropTypes.string,
    companyWebsite: PropTypes.string,
    hiringTimeline: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  userType: PropTypes.oneOf(['jobseeker', 'recruiter', 'both']),
  showCompanyInfo: PropTypes.bool,
  showSkills: PropTypes.bool,
  showExperience: PropTypes.bool,
  showSalaryExpectations: PropTypes.bool,
  className: PropTypes.string,
};

export default ProfessionalInfoSection;