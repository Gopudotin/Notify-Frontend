import React from 'react';

const TemplateDropdown = ({ selectedTemplate }) => {
  return (
    <div>
      <label htmlFor="template">Template:</label>
      <input type="text" id="template" className="form-control" value={selectedTemplate} readOnly />
    </div>
  );
};

export default TemplateDropdown;
