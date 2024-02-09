// NotificationTypeDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationTypeDropdown = ({ selectedType, handleTypeChange }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    // Fetch types from backend
    axios.get('http://localhost:3000/type')
      .then(response => {
        console.log('Types fetched successfully:', response.data);
        setTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching types:', error);
      });
  }, []);
  

  return (
    <div>
      <label htmlFor="type">Type:</label>
      <select id="type" value={selectedType} onChange={handleTypeChange}>
        <option value="">Select type</option>
        {types.map(type => (
          <option key={type.id} value={type.name}>{type.name}</option>
        ))}
      </select>
    </div>
  );
};

export default NotificationTypeDropdown;
