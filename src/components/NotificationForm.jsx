// NotificationForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TemplateDropdown from './TemplateDropdown';
import PayloadDropdown from './PayloadDropdown';
import SubscribersDropdown from './SubscribersDropdown';

const NotificationForm = () => {
  const [types, setTypes] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [selectedPayload, setSelectedPayload] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [sendInstantly, setSendInstantly] = useState(true);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [templateText, setTemplateText] = useState(''); // State for the template text

  useEffect(() => {
    axios.get('http://localhost:3000/type')
      .then(response => {
        setTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching types:', error);
      });

    axios.get('http://localhost:3000/subscriber')
      .then(response => {
        setSubscribers(response.data);
      })
      .catch(error => {
        console.error('Error fetching subscribers:', error);
      });
  }, []);
  useEffect(() => {
    if (selectedType) {
      switch (selectedType.toLowerCase()) {
        case 'promotion':
          setTemplateOptions([
            { value: 'Team Lead', label: 'Team Lead' },
            { value: 'Manager', label: 'Manager' },
            { value: 'Senior Engineer', label: 'Senior Engineer' },
          ]);
          break;
        case 'birthday':
          setTemplateOptions([
            { value: 'Happy Birthday', label: 'Happy Birthday' },
            { value: 'Many Many Happy returns of the day', label: 'Many Many Happy returns of the day' },
            { value: 'Hope you achieve great heights in your life!', label: 'Hope you achieve great heights in your life!' },
          ]);
          break;
        case 'welcome':
          setTemplateOptions([
            { value: 'Fresher', label: 'Fresher' },
            { value: 'Experienced', label: 'Experienced' },
          ]);
          break;
        default:
          setTemplateOptions([]);
          break;
      }
    } else {
      setTemplateOptions([]);
    }
  }, [selectedType]);

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const handleTemplateTextChange = (event) => {
    setTemplateText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let notificationMessage = selectedTemplate;

    if (selectedPayload) {
      notificationMessage += ` With Regards ${selectedPayload}`;
    }

    notificationMessage = templateText ? templateText : notificationMessage;

    if (sendInstantly) {
      try {
        const response = await axios.post('http://localhost:3000/notification', {
          title: selectedType,
          description: notificationMessage,
          subscribers: selectedSubscribers.map(subscriber => subscriber.id),
          payload: selectedPayload || null,
        });
        console.log('Notification created successfully:', response.data);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3000/schedule-notification', {
          title: selectedType,
          description: notificationMessage,
          subscribers: selectedSubscribers.map(subscriber => subscriber.id),
          payload: selectedPayload || null,
          scheduleDate,
          scheduleTime,
        });
        console.log('Notification scheduled successfully:', response.data);
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className="text-center mb-4">Create Notification</h2>
      <div className='rounded bg-white border shadow p-4'>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Type:</label>
            <select className="form-select" id="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Select type</option>
              {types.map(type => (
                <option key={type.id} value={type.value}>{type.name}</option>
              ))}
            </select>
          </div>

          {selectedType && (
            <>
              <div className="mb-3">
                <label htmlFor="templateText" className="form-label">Template Text:</label>
                <input type="text" id="templateText" className="form-control" value={templateText} onChange={handleTemplateTextChange} />
              </div>
              <TemplateDropdown
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                templateOptions={templateOptions}
                handleTemplateChange={handleTemplateChange}
              />
              <PayloadDropdown
                selectedPayload={selectedPayload}
                setSelectedPayload={setSelectedPayload}
              />
              <SubscribersDropdown
                subscribers={subscribers}
                selectedSubscribers={selectedSubscribers}
                setSelectedSubscribers={setSelectedSubscribers}
              />
            </>
          )}

          <div className="mb-3">
            <label htmlFor="scheduleDate" className="form-label">Scheduled Date:</label>
            <input type="date" id="scheduleDate" className="form-control" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="scheduleTime" className="form-label">Scheduled Time:</label>
            <input type="time" id="scheduleTime" className="form-control" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="sendInstantly" checked={sendInstantly} onChange={(e) => setSendInstantly(e.target.checked)} />
            <label className="form-check-label" htmlFor="sendInstantly">Send Instantly</label>
          </div>

          <button type="submit" className='btn btn-success'>Create</button>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
