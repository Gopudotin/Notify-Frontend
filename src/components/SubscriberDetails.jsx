import React from 'react';
import './SubscriberDetails.css';

const SubscriberDetails = ({ subscriberDetails }) => {
  return (
    <div className="container mt-5">
      <h5 className="subscriber-details-heading">Subscriber Details</h5>
      <div className="subscriber-details-container">
        <div className="rounded bg-white border shadow p-4">
          <p><strong>Name:</strong> {subscriberDetails.name}</p>
          <p><strong>ID:</strong> {subscriberDetails.id}</p>
          <p><strong>Created At:</strong> {subscriberDetails.created_at}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDetails;
