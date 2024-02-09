import React from 'react';

const SubscribersDropdown = ({ subscribers, selectedSubscribers, setSelectedSubscribers }) => {
  return (
    <div className="mb-3">
      <label htmlFor="subscribers" className="form-label">Subscribers:</label>
      <select id="subscribers" multiple className="form-select" value={selectedSubscribers} onChange={(e) => setSelectedSubscribers(Array.from(e.target.selectedOptions, option => parseInt(option.value)))}>
        {subscribers.map(subscriber => (
          <option key={subscriber.id} value={subscriber.id}>{subscriber.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SubscribersDropdown;
