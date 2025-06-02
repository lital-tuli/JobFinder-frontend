import PropTypes from 'prop-types';
import FormField from '../../../../components/common/FormField/FormField';

const ProfessionalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`professional-info-section ${className}`}>
      <div className="section-header mb-4">
        <h5 className="fw-semibold mb-2 d-flex align-items-center">
          <i className="bi bi-briefcase me-2 text-primary"></i>
          Professional Information
        </h5>
        <p className="text-muted small mb-0">
          Tell us about your professional background
        </p>
      </div>

      {/* Role Selection - matches backend enum: ["jobseeker", "recruiter", "admin"] */}
      <div className="mb-4">
        <FormField
          label="I am a"
          name="role"
          type="select"
          value={formData.role || 'jobseeker'}
          error={errors.role}
          onChange={(value) => onChange('role', value)}
          required
        >
          <option value="">Select your role</option>
          <option value="jobseeker">Job Seeker - Looking for opportunities</option>
          <option value="recruiter">Recruiter/Employer - Posting jobs</option>
          <option value="admin">Administrator</option>
        </FormField>
      </div>

      {/* Current Position/Title - matches backend 'profession' field */}
      <div className="mb-4">
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

      {/* Bio/Professional Summary - matches backend 'bio' field */}
      <div className="mb-4">
        <FormField
          label="Professional Summary"
          name="bio"
          type="textarea"
          value={formData.bio || ''}
          error={errors.bio}
          onChange={(value) => onChange('bio', value)}
          placeholder="Describe your professional background, key achievements, and career goals..."
          helpText="Tell us about yourself professionally"
          rows={4}
        />
      </div>

      {/* Additional Info for different roles */}
      {formData.role === 'jobseeker' && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="fw-semibold mb-2 text-primary">
            <i className="bi bi-info-circle me-2"></i>
            For Job Seekers
          </h6>
          <p className="small text-muted mb-0">
            After registration, you'll be able to search for jobs, save favorites, and apply to positions that match your skills and interests.
          </p>
        </div>
      )}

      {formData.role === 'recruiter' && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="fw-semibold mb-2 text-primary">
            <i className="bi bi-building me-2"></i>
            For Recruiters
          </h6>
          <p className="small text-muted mb-0">
            After registration, you'll be able to post job listings, manage applications, and find qualified candidates for your open positions.
          </p>
        </div>
      )}

      {formData.role === 'admin' && (
        <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded">
          <h6 className="fw-semibold mb-2 text-warning">
            <i className="bi bi-shield-exclamation me-2"></i>
            Administrator Access
          </h6>
          <p className="small text-muted mb-0">
            Administrator accounts have full access to manage users, job listings, and system settings. Please only select this if you are authorized to have admin privileges.
          </p>
        </div>
      )}
    </div>
  );
};

ProfessionalInfoSection.propTypes = {
  formData: PropTypes.shape({
    role: PropTypes.string,
    profession: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ProfessionalInfoSection;
