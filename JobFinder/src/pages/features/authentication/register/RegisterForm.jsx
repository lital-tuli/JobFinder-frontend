import React from 'react';
import { useRegisterForm } from './hooks/useRegisterForm';
import PersonalInfoSection from './components/PersonalInfoSection';
import AccountInfoSection from './components/AccountInfoSection';
import ProfessionalInfoSection from './components/ProfessionalInfoSection';
import SubmitButton from '../../../common/ui/SubmitButton';

const RegisterForm = () => {
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    isFormValid
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit}>
      <PersonalInfoSection 
        data={formData}
        errors={errors}
        onChange={handleChange}
      />
      <AccountInfoSection 
        data={formData}
        errors={errors}
        onChange={handleChange}
      />
      <ProfessionalInfoSection 
        data={formData}
        errors={errors}
        onChange={handleChange}
      />
      <SubmitButton 
        loading={loading}
        disabled={!isFormValid()}
        text="Create Account"
        loadingText="Creating Account..."
      />
    </form>
  );
};

export default RegisterForm;