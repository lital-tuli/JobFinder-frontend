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
  
  return (
    <Modal show onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Resume Builder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="resume-wizard">
          <ProgressIndicator steps={steps} currentStep={currentStep} />
          <StepContent 
            step={steps[currentStep - 1]} 
            data={resumeData}
            onChange={setResumeData}
          />
          <WizardNavigation 
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={() => setCurrentStep(s => s + 1)}
            onPrev={() => setCurrentStep(s => s - 1)}
            onSave={() => onSave(resumeData)}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};