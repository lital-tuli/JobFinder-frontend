
import { useState } from 'react';
import PropTypes from 'prop-types';

const ResumeWizard = ({ onSave, onClose }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profession: ''
    },
    experience: [],
    education: [],
    skills: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Add experience
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
    
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  // Add education
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      year: ''
    };
    
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  // Add skill
  const addSkill = (skill) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleSave = () => {
    // Generate resume file (simplified)
    const resumeContent = {
      ...resumeData,
      createdAt: new Date().toISOString(),
      name: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`
    };
    
    onSave(resumeContent);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Simple Resume Builder</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            
            {/* Progress Indicator */}
            <div className="progress mb-4" style={{ height: '4px' }}>
              <div 
                className="progress-bar" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="personal-info-step">
                <h4 className="mb-3">Personal Information</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={resumeData.personalInfo.firstName}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={resumeData.personalInfo.lastName}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Professional Title"
                      value={resumeData.personalInfo.profession}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, profession: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Experience Step */}
            {currentStep === 2 && (
              <div className="experience-step">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Work Experience</h4>
                  <button type="button" className="btn btn-primary btn-sm" onClick={addExperience}>
                    <i className="bi bi-plus me-1"></i>Add Experience
                  </button>
                </div>
                
                {resumeData.experience.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-briefcase text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-3">No experience added yet</p>
                    <button type="button" className="btn btn-primary" onClick={addExperience}>
                      Add Your First Experience
                    </button>
                  </div>
                ) : (
                  resumeData.experience.map((exp) => (
                    <div key={exp.id} className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, experience: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Position"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, position: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, experience: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type="month"
                              className="form-control form-control-sm"
                              placeholder="Start Date"
                              value={exp.startDate}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, startDate: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, experience: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type="month"
                              className="form-control form-control-sm"
                              placeholder="End Date"
                              value={exp.endDate}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, endDate: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, experience: updated }));
                              }}
                              disabled={exp.current}
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={exp.current}
                                onChange={(e) => {
                                  const updated = resumeData.experience.map(item =>
                                    item.id === exp.id ? { ...item, current: e.target.checked } : item
                                  );
                                  setResumeData(prev => ({ ...prev, experience: updated }));
                                }}
                              />
                              <label className="form-check-label">Current Position</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <textarea
                              className="form-control form-control-sm"
                              rows="2"
                              placeholder="Brief description of responsibilities"
                              value={exp.description}
                              onChange={(e) => {
                                const updated = resumeData.experience.map(item =>
                                  item.id === exp.id ? { ...item, description: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, experience: updated }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Education Step */}
            {currentStep === 3 && (
              <div className="education-step">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Education</h4>
                  <button type="button" className="btn btn-primary btn-sm" onClick={addEducation}>
                    <i className="bi bi-plus me-1"></i>Add Education
                  </button>
                </div>
                
                {resumeData.education.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-mortarboard text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-3">No education added yet</p>
                    <button type="button" className="btn btn-primary" onClick={addEducation}>
                      Add Your Education
                    </button>
                  </div>
                ) : (
                  resumeData.education.map((edu) => (
                    <div key={edu.id} className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = resumeData.education.map(item =>
                                  item.id === edu.id ? { ...item, institution: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Degree"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = resumeData.education.map(item =>
                                  item.id === edu.id ? { ...item, degree: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-8 mb-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Field of Study"
                              value={edu.field}
                              onChange={(e) => {
                                const updated = resumeData.education.map(item =>
                                  item.id === edu.id ? { ...item, field: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                          <div className="col-md-4 mb-2">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="Year"
                              value={edu.year}
                              onChange={(e) => {
                                const updated = resumeData.education.map(item =>
                                  item.id === edu.id ? { ...item, year: e.target.value } : item
                                );
                                setResumeData(prev => ({ ...prev, education: updated }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Skills Step */}
            {currentStep === 4 && (
              <div className="skills-step">
                <h4 className="mb-3">Skills</h4>
                
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addSkill(input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="skills-display">
                  {resumeData.skills.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-gear text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="text-muted mt-3">No skills added yet</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center">
                          {skill}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.7em' }}
                            onClick={() => {
                              const updated = resumeData.skills.filter((_, i) => i !== index);
                              setResumeData(prev => ({ ...prev, skills: updated }));
                            }}
                          ></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
          
          {/* Modal Footer with Navigation */}
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                disabled={currentStep === 1}
              >
                <i className="bi bi-arrow-left me-2"></i>Previous
              </button>
              
              <span className="badge bg-light text-dark px-3 py-2">
                Step {currentStep} of {totalSteps}
              </span>
              
              {currentStep === totalSteps ? (
                <button type="button" className="btn btn-success" onClick={handleSave}>
                  <i className="bi bi-download me-2"></i>Save Resume
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(s => Math.min(totalSteps, s + 1))}
                >
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResumeWizard.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ResumeWizard;
