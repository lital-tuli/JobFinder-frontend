import React from 'react';
import FormField from '../../../../common/forms/FormField';

const PersonalInfoSection = ({ data, errors, onChange }) => (
  <div className="personal-info-section mb-4">
    <h6 className="fw-semibold mb-3">Personal Information</h6>
    <div className="row">
      <FormField
        label="First Name"
        name="firstName"
        value={data.name.first}
        error={errors.firstName}
        onChange={(value) => onChange('name.first', value)}
        required
        className="col-md-4"
      />
      <FormField
        label="Middle Name"
        name="middleName"
        value={data.name.middle}
        onChange={(value) => onChange('name.middle', value)}
        className="col-md-4"
      />
      <FormField
        label="Last Name"
        name="lastName"
        value={data.name.last}
        error={errors.lastName}
        onChange={(value) => onChange('name.last', value)}
        required
        className="col-md-4"
      />
    </div>
  </div>
);

export default PersonalInfoSection;