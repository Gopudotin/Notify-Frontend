// SubscriberView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SubscriberView = () => {
  const { id: subscriberId } = useParams();
  const [subscriber, setSubscriber] = useState({});
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    if (subscriberId !== undefined) {
      axios.get(`http://localhost:3000/subscriber/${subscriberId}`)
        .then(response => {
          console.log('Subscriber fetched successfully:', response.data);
          setSubscriber(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching subscriber:', error);
          setLoading(false);
        });
      
      axios.get(`http://localhost:3000/subscriber/${subscriberId}/notifications/unread`)
        .then(response => {
          console.log('Unread notifications fetched successfully:', response.data);
          setUnreadNotifications(response.data);
        })
        .catch(error => {
          console.error('Error fetching unread notifications:', error);
        });
    } else {
      console.error('SubscriberId is undefined.');
      setLoading(false);
    }
  }, [subscriberId]);

  const handleViewNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/subscriber/${subscriberId}/notifications/unread`);
      console.log('Unread notifications fetched successfully:', response.data);
      setUnreadNotifications(response.data);
      await markNotificationsAsRead(response.data.map(notification => notification.id));
    } catch (error) {
      console.error('Error handling view notifications:', error);
    }
  };

  const markNotificationsAsRead = async (notificationIds) => {
    try {
      await Promise.all(notificationIds.map(notificationId => 
        axios.put(`http://localhost:3000/subscriber/${subscriberId}/${notificationId}/read`)
      ));
      console.log('Notifications marked as read successfully.');
      setUnreadNotifications([]);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Subscriber View - {subscriber.name}</h2>
      <div className="row">
        <div className="col">
          <p><strong>ID:</strong> {subscriber.id}</p>
          <p><strong>Name:</strong> {subscriber.name}</p>
          <p><strong>Created At:</strong> {subscriber.createdAt}</p>
          <p><strong>Updated At:</strong> {subscriber.updatedAt}</p>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col">
          <button className="btn btn-primary mb-3" onClick={handleViewNotifications}>
            {unreadNotifications.length > 0 ? `View Notifications (${unreadNotifications.length} unread)` : "View Notifications"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberView;