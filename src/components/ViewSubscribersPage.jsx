import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import SubscriberDetails from './SubscriberDetails';

const ViewSubscribersPage = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [subscriberDetails, setSubscriberDetails] = useState(null);
  const [subscriberNotifications, setSubscriberNotifications] = useState([]);
  const [subscriberOptions, setSubscriberOptions] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/subscriber');
        const options = response.data.map(subscriber => ({
          value: subscriber.id,
          label: subscriber.name,
        }));
        setSubscriberOptions(options);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };

    fetchSubscribers();
  }, []);

  const handleSelectSubscriber = async (selectedOption) => {
    setSelectedSubscriber(selectedOption);
    try {
      const response = await axios.get(`http://localhost:3000/subscriber/${selectedOption.value}`);
      setSubscriberDetails(response.data);
      setSubscriberNotifications([]);
    } catch (error) {
      console.error('Error fetching subscriber details:', error);
    }
  };

  const handleViewNotifications = async () => {
    if (selectedSubscriber) {
      try {
        const response = await axios.get(`http://localhost:3000/subscriber/${selectedSubscriber.value}/notifications`);
        setSubscriberNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/sub-notification/read/${selectedSubscriber.value}/${notificationId}`);
      const updatedNotifications = subscriberNotifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, has_read: true };
        }
        return notification;
      });
      setSubscriberNotifications(updatedNotifications);
      alert('Notification marked as read successfully');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Subscribers</h2>
      <div className="mb-3">
        <Select id="subscribers" value={selectedSubscriber} onChange={handleSelectSubscriber} options={subscriberOptions} isClearable />
      </div>
      {selectedSubscriber && (
        <div>
          <SubscriberDetails subscriberDetails={subscriberDetails} />
          <button className="btn btn-outline-primary view-notification-button" onClick={handleViewNotifications}>View Notifications</button>
        </div>
      )}
      {subscriberNotifications.length > 0 && (
        <div>
          <h3>Notifications:</h3>
          <ul>
            {subscriberNotifications.map(notification => (
              <li key={notification.id}>
                <strong>Title:</strong> {notification.notification.title}<br />
                <strong>Description:</strong> {notification.notification.description}<br />
                <button onClick={() => handleMarkAsRead(notification.notification_id)} disabled={notification.has_read} className="btn btn-outline-primary viewMark">Mark as Read</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewSubscribersPage;
