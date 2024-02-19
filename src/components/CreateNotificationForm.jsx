// CreateNotificationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const CreateNotificationForm = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [sendInstantly, setSendInstantly] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [subscriberOptions, setSubscriberOptions] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    // Fetch notification types
    axios.get('http://localhost:3000/type')
      .then(response => {
        const options = response.data.map(type => ({
          value: type.id,
          label: type.name,
        }));
        setTypeOptions(options);
      })
      .catch(error => console.error('Error fetching notification types:', error));

    // Fetch subscribers
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

  const fetchTemplatesByType = (typeId) => {
    axios.get(`http://localhost:3000/template?typeId=${typeId}`)
      .then(response => {
        const options = response.data.map(template => ({
          value: template.id,
          label: template.template,
        }));
        setTemplateOptions(options);
      })
      .catch(error => console.error('Error fetching templates by type:', error));
  };

  const handleTypeChange = (option) => {
    setSelectedType(option.value);
    fetchTemplatesByType(option.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const subscribers = selectedSubscribers.map(subscriber => subscriber.value);
    const data = {
      type_id: selectedType,
      template_id: selectedTemplate,
      subscribers,
      send_instantly: sendInstantly,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
    };
    try {
      const response = await axios.post('http://localhost:3000/notification', data);
      console.log('Notification created:', response.data);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create Notification</h2>
      <div className="rounded bg-white border shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Type:</label>
            <Select
              id="type"
              value={typeOptions.find(option => option.value === selectedType)}
              onChange={handleTypeChange}
              options={typeOptions}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="template" className="form-label">Template:</label>
            <Select
              id="template"
              value={templateOptions.find(option => option.value === selectedTemplate)}
              onChange={(option) => setSelectedTemplate(option.value)}
              options={templateOptions}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="subscribers" className="form-label">Subscribers:</label>
            <Select
              id="subscribers"
              value={selectedSubscribers}
              onChange={setSelectedSubscribers}
              options={subscriberOptions}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="sendInstantly" checked={sendInstantly} onChange={(e) => setSendInstantly(e.target.checked)} />
            <label className="form-check-label" htmlFor="sendInstantly">Send Instantly</label>
          </div>

          {!sendInstantly && (
            <>
              <div className="mb-3">
                <label htmlFor="scheduledDate" className="form-label">Scheduled Date:</label>
                <input type="date" id="scheduledDate" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="scheduledTime" className="form-label">Scheduled Time:</label>
                <input type="time" id="scheduledTime" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              </div>
            </>
          )}

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Create Notification</button>
            <Link to="/view-subscribers" className="btn btn-outline-primary">View Subscribers</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotificationForm;
