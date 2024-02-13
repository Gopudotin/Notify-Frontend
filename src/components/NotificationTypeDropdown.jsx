import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationTypeDropdown = ({ types, selectedType, setSelectedType }) => {
  return (
    <div>
      <label htmlFor="type">Type:</label>
      <select id="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        <option value="">Select type</option>
        {types.map(type => (
          <option key={type.id} value={type.name}>{type.name}</option>
        ))}
      </select>
    </div>
  );
};

export default NotificationTypeDropdown;
