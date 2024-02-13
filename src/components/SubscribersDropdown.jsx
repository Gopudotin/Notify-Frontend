// SubscribersDropdown.jsx
import React from 'react';
import Select from 'react-select';

const SubscribersDropdown = ({ subscribers, selectedSubscribers, setSelectedSubscribers }) => {
  // Map subscribers to options
  const options = subscribers.map(subscriber => ({
    value: subscriber.id,
    label: subscriber.name // Display subscriber names
  }));

  const handleChange = selectedOptions => {
    setSelectedSubscribers(selectedOptions);
  };

  return (
    <div className="mb-3">
      <label htmlFor="subscribers" className="form-label">Subscribers:</label>
      <Select
        id="subscribers"
        isMulti
        value={selectedSubscribers}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};

export default SubscribersDropdown;
