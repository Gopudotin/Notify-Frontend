import React from 'react';

const TemplateDropdown = ({ selectedTemplate, setSelectedTemplate, templateOptions, handleTemplateChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor="template" className="form-label">Template:</label>
      <select id="template" className="form-select" value={selectedTemplate} onChange={handleTemplateChange}>

        <option value="">Select template</option>
        {templateOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default TemplateDropdown;