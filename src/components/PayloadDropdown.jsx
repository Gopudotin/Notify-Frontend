// PayloadDropdown.jsx
import React from 'react';

const PayloadDropdown = ({ selectedPayload, setSelectedPayload }) => {
  const handlePayloadChange = (event) => {
    setSelectedPayload(event.target.value);
  };

  return (
    <div className="mb-3">
      <label htmlFor="payload" className="form-label">Payload:</label>
      <select id="payload" className="form-select" value={selectedPayload} onChange={handlePayloadChange}>
        <option value="">Select payload</option>
        <option value="CEO">CEO</option>
        <option value="CFO">CFO</option>
        <option value="DIRECTOR">DIRECTOR</option>
        <option value="CTO">CTO</option>
        <option value="Manager">Manager</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default PayloadDropdown;
