import React from 'react';
import FormField from '../../../../components/common/forms/FormField';
import PasswordStrengthIndicator from '../../PasswordStrengthIndicator';
import SectionHeader from '../../../../components/common/ui/SectionHeader';

const AccountSection = ({ data, errors, onChange }) => (
  <div className="account-section mb-4">
    <SectionHeader 
      title="Account Information" 
      subtitle="Set up your login credentials"
    />
    
    <div className="row">
      <div className="col-md-12 mb-3">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={data.email}
          error={errors.email}
          onChange={(value) => onChange('email', value)}
          placeholder="your.email@example.com"
          required
        />
      </div>
      
      <div className="col-md-6">
        <FormField
          label="Password"
          name="password"
          type="password"
          value={data.password}
          error={errors.password}
          onChange={(value) => onChange('password', value)}
          placeholder="Create a strong password"
          required
        />
        <PasswordStrengthIndicator password={data.password} />
      </div>
      
      <div className="col-md-6">
        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={data.confirmPassword}
          error={errors.confirmPassword}
          onChange={(value) => onChange('confirmPassword', value)}
          placeholder="Repeat your password"
          required
        />
      </div>
    </div>
  </div>
);

export default AccountSection;