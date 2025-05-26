import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Progress Indicator Component
const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="progress-indicator mb-4">
      <div className="d-flex justify-content-between">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`step-item d-flex flex-column align-items-center ${
              step.id <= currentStep ? 'active' : ''
            }`}
            style={{ flex: 1 }}
          >
            <div 
              className={`step-circle rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                step.id <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'
              }`}
              style={{ width: '40px', height: '40px' }}
            >
              {step.id < currentStep ? (
                <i className="bi bi-check"></i>
              ) : (
                step.id
              )}
            </div>
            <small className={`text-center ${step.id <= currentStep ? 'text-primary' : 'text-muted'}`}>
              {step.title}
            </small>
            {index < steps.length - 1 && (
              <div 
                className={`step-line ${step.id < currentStep ? 'bg-primary' : 'bg-light'}`}
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '50%', 
                  width: '100%', 
                  height: '2px', 
                  zIndex: -1 
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Personal Information Step
const PersonalInfoStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="personal-info-step">
      <h4 className="mb-4">Personal Information</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            className="form-control"
            value={data.personalInfo.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            className="form-control"
            value={data.personalInfo.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            value={data.personalInfo.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            value={data.personalInfo.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Professional Title</label>
        <input
          type="text"
          className="form-control"
          value={data.personalInfo.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Software Engineer, Marketing Manager"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-control"
          rows="4"
          value={data.personalInfo.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Brief overview of your professional background and key achievements"
        />
      </div>
    </div>
  );
};

// Experience Step
const ExperienceStep = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    onChange({
      ...data,
      experience: [...data.experience, newExperience]
    });
  };

  const updateExperience = (id, field, value) => {
    const updatedExperience = data.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    
    onChange({
      ...data,
      experience: updatedExperience
    });
  };

  const removeExperience = (id) => {
    const updatedExperience = data.experience.filter(exp => exp.id !== id);
    onChange({
      ...data,
      experience: updatedExperience
    });
  };

  return (
    <div className="experience-step">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Work Experience</h4>
        <button type="button" className="btn btn-primary" onClick={addExperience}>
          <i className="bi bi-plus me-2"></i>Add Experience
        </button>
      </div>
      
      {data.experience.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-briefcase text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-3">No work experience added yet</p>
          <button type="button" className="btn btn-outline-primary" onClick={addExperience}>
            Add Your First Experience
          </button>
        </div>
      ) : (
        data.experience.map((exp) => (
          <div key={exp.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h6>Experience #{data.experience.indexOf(exp) + 1}</h6>
                <button 
                  type="button" 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeExperience(exp.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Position *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="month"
                    className="form-control"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="month"
                    className="form-control"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    />
                    <label className="form-check-label">Currently working here</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Education Step
const EducationStep = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    
    onChange({
      ...data,
      education: [...data.education, newEducation]
    });
  };

  const updateEducation = (id, field, value) => {
    const updatedEducation = data.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    onChange({
      ...data,
      education: updatedEducation
    });
  };

  const removeEducation = (id) => {
    const updatedEducation = data.education.filter(edu => edu.id !== id);
    onChange({
      ...data,
      education: updatedEducation
    });
  };

  return (
    <div className="education-step">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Education</h4>
        <button type="button" className="btn btn-primary" onClick={addEducation}>
          <i className="bi bi-plus me-2"></i>Add Education
        </button>
      </div>
      
      {data.education.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-mortarboard text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-3">No education added yet</p>
          <button type="button" className="btn btn-outline-primary" onClick={addEducation}>
            Add Your Education
          </button>
        </div>
      ) : (
        data.education.map((edu) => (
          <div key={edu.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h6>Education #{data.education.indexOf(edu) + 1}</h6>
                <button 
                  type="button" 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeEducation(edu.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Institution *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University/School name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Degree *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Field of Study</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Start Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    placeholder="2020"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">End Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">GPA</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Skills Step
const SkillsStep = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({
        ...data,
        skills: [...data.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange({
      ...data,
      skills: data.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="skills-step">
      <h4 className="mb-4">Skills</h4>
      
      <div className="mb-4">
        <label className="form-label">Add Skills</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, Project Management"
          />
          <button type="button" className="btn btn-primary" onClick={addSkill}>
            Add
          </button>
        </div>
        <small className="form-text text-muted">Press Enter or click Add to include a skill</small>
      </div>
      
      <div className="skills-list">
        <h6>Your Skills ({data.skills.length})</h6>
        {data.skills.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-gear text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">No skills added yet</p>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="badge bg-primary d-flex align-items-center">
                {skill}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.7em' }}
                  onClick={() => removeSkill(skill)}
                ></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Preview Step
const PreviewStep = ({ data }) => {
  return (
    <div className="preview-step">
      <h4 className="mb-4">Resume Preview</h4>
      <div className="resume-preview bg-light p-4 rounded">
        {/* Personal Info */}
        <div className="text-center mb-4">
          <h2 className="mb-1">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h2>
          {data.personalInfo.title && (
            <h5 className="text-muted mb-2">{data.personalInfo.title}</h5>
          )}
          <div className="contact-info">
            {data.personalInfo.email && (
              <span className="me-3">
                <i className="bi bi-envelope me-1"></i>
                {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span>
                <i className="bi bi-telephone me-1"></i>
                {data.personalInfo.phone}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-4">
            <h6 className="border-bottom pb-2">Professional Summary</h6>
            <p>{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-4">
            <h6 className="border-bottom pb-2">Work Experience</h6>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>{exp.position}</strong>
                  <span className="text-muted">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-muted">{exp.company}</div>
                {exp.description && <p className="mt-2 mb-0">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-4">
            <h6 className="border-bottom pb-2">Education</h6>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>{edu.degree} in {edu.field}</strong>
                  <span className="text-muted">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-muted">
                  {edu.institution}
                  {edu.gpa && <span className="ms-2">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h6 className="border-bottom pb-2">Skills</h6>
            <div className="d-flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="badge bg-secondary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wizard Navigation
const WizardNavigation = ({ currentStep, totalSteps, onNext, onPrev, onSave }) => {
  return (
    <div className="wizard-navigation d-flex justify-content-between mt-4">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onPrev}
        disabled={currentStep === 1}
      >
        <i className="bi bi-arrow-left me-2"></i>Previous
      </button>
      
      {currentStep === totalSteps ? (
        <button type="button" className="btn btn-success" onClick={onSave}>
          <i className="bi bi-download me-2"></i>Save Resume
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next <i className="bi bi-arrow-right ms-2"></i>
        </button>
      )}
    </div>
  );
};

// Main Resume Wizard Component
const ResumeWizard = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const steps = [
    { id: 1, title: 'Personal Information', component: PersonalInfoStep },
    { id: 2, title: 'Work Experience', component: ExperienceStep },
    { id: 3, title: 'Education', component: EducationStep },
    { id: 4, title: 'Skills', component: SkillsStep },
    { id: 5, title: 'Preview & Save', component: PreviewStep }
  ];

  const getCurrentStepComponent = () => {
    const currentStepData = steps[currentStep - 1];
    const StepComponent = currentStepData.component;
    
    return (
      <StepComponent 
        data={resumeData} 
        onChange={setResumeData}
      />
    );
  };

  const handleSave = () => {
    onSave(resumeData);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Resume Builder</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="resume-wizard">
              <ProgressIndicator steps={steps} currentStep={currentStep} />
              {getCurrentStepComponent()}
              <WizardNavigation 
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={() => setCurrentStep(s => s + 1)}
                onPrev={() => setCurrentStep(s => s - 1)}
                onSave={handleSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResumeWizard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ResumeWizard;