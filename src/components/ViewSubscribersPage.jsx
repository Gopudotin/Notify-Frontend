import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import SubscriberDetails from './SubscriberDetails';

const ViewSubscribersPage = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [subscriberDetails, setSubscriberDetails] = useState(null);
  const [subscriberOptions, setSubscriberOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/subscriber')
      .then(response => {
        const options = response.data.map(subscriber => ({
          value: subscriber.id,
          label: subscriber.name,
        }));
        setSubscriberOptions(options);
      })
      .catch(error => console.error('Error fetching subscribers:', error));
  }, []);

  const handleSelectSubscriber = async (selectedOption) => {
    setSelectedSubscriber(selectedOption);
    try {
      const response = await axios.get(`http://localhost:3000/subscriber/${selectedOption.value}`);
      setSubscriberDetails(response.data);
    } catch (error) {
      console.error('Error fetching subscriber details:', error);
    }
  };

  const handleViewNotifications = () => {
    // Implement logic to view notifications for the selected subscriber
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Subscribers</h2>
      <div className="mb-3">
        <Select
          id="subscribers"
          value={selectedSubscriber}
          onChange={handleSelectSubscriber}
          options={subscriberOptions}
          isClearable
        />
      </div>
      {subscriberDetails && (
        <div>
          <SubscriberDetails subscriberDetails={subscriberDetails} />
          <button className="btn btn-outline-primary view-notification-button" onClick={handleViewNotifications}>View Notifications</button>
        </div>
      )}
    </div>
  );
};

export default ViewSubscribersPage;
