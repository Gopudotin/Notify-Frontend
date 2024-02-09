import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationTypeDropdown from './NotificationTypeDropdown';
import TemplateDropdown from './TemplateDropdown'; 
import SubscribersDropdown from './SubscribersDropdown'; 
import 'bootstrap/dist/css/bootstrap.css';

const NotificationForm = () => {
  const [types, setTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [notification, setNotification] = useState('');
  const [payload, setPayload] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Fetch types, templates, and subscribers
    axios.get('http://localhost:3000/type')
      .then(response => {
        setTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching types:', error);
      });

    axios.get('http://localhost:3000/template')
      .then(response => {
        setTemplates(response.data);
      })
      .catch(error => {
        console.error('Error fetching templates:', error);
      });

    axios.get('http://localhost:3000/subscriber')
      .then(response => {
        setSubscribers(response.data);
      })
      .catch(error => {
        console.error('Error fetching subscribers:', error);
      });
  }, []);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    // Automatically select template based on type
    const selectedTypeObj = types.find(type => type.name === event.target.value);
    if (selectedTypeObj) {
      const correspondingTemplate = templates.find(template => template.notification_type === selectedTypeObj.id);
      if (correspondingTemplate) {
        setSelectedTemplate(correspondingTemplate.template);
      } else {
        setSelectedTemplate(''); // Clear selected template if no corresponding template is found
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create notification payload
    const notificationData = {
      type: selectedType,
      template: selectedTemplate,
      subscribers: selectedSubscribers,
      description: `${notification} ${payload}`, // Update description with payload
      date: date
    };
    // Send notification data to backend
    axios.post('http://localhost:3000/notification', notificationData)
      .then(response => {
        console.log('Notification created successfully:', response.data);
      })
      .catch(error => {
        console.error('Error creating notification:', error);
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-light vh-70'>
      <div className='w-50'>
        <h2 className="text-center mb-4">Create Notification</h2>
        <div className='rounded bg-white border shadow p-4'>
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              {types.length > 0 ? (
                <NotificationTypeDropdown types={types} selectedType={selectedType} handleTypeChange={handleTypeChange} />
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="mb-3">
              <TemplateDropdown templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
            </div>
            <div className="mb-3">
              <SubscribersDropdown subscribers={subscribers} selectedSubscribers={selectedSubscribers} setSelectedSubscribers={setSelectedSubscribers} />
            </div>
            <div className="mb-3">
              <label htmlFor="notification" className="form-label">Notification:</label>
              <input type="text" id="notification" className="form-control" value={notification} onChange={(e) => setNotification(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="payload" className="form-label">Payload:</label>
              <input type="text" id="payload" className="form-control" value={payload} onChange={(e) => setPayload(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date:</label>
              <input type="date" id="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button type="submit" className='btn btn-success'>Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;
