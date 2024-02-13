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
    const selectedTemplateValue = event.target.value;
    setSelectedTemplate(selectedTemplateValue);
    handleTemplateTextChange(selectedTemplateValue); // Call the function to update template text
  };

  useEffect(() => {
    handleTemplateTextChange(selectedTemplate); // Call handleTemplateTextChange when selectedSubscribers change
  }, [selectedSubscribers]); // Add selectedSubscribers as a dependency
  
  useEffect(() => {
    // Call handleTemplateTextChange when selectedPayload changes
    handleTemplateTextChange(selectedTemplate);
  }, [selectedPayload]); // Add selectedPayload as a dependency

  const handleTemplateTextChange = (selectedTemplateValue) => {
    // Initialize an empty string to store the combined template text
    let combinedTemplateText = '';
  
    // Loop through each selected subscriber
    //we iterate over each selected subscriber using selectedSubscribers.forEach. 
     //For each subscriber, we construct a new template text based on 
     //the selected type and template option
    selectedSubscribers.forEach(subscriber => {
      let newTemplateText = '';
  
      const subscriberName = subscriber.label;
  
      // Construct the template text based on the selected type and template option
      switch (selectedType.toLowerCase()) {
        case 'promotion':
          newTemplateText = `Hi ${subscriberName}, you have been promoted to ${selectedTemplateValue}.`;
          break;
        case 'birthday':
          switch (selectedTemplateValue.toLowerCase()) {
            case 'happy birthday':
              newTemplateText = `Hi ${subscriberName}, Happy Birthday!`;
              break;
            case 'many many happy returns of the day':
              newTemplateText = `Hi ${subscriberName}, Many Many Happy Returns of the Day!`;
              break;
            case 'hope you achieve great heights in your life':
              newTemplateText = `Hi ${subscriberName}, Hope you achieve great heights in your life!`;
              break;
            default:
              break;
          }
          break;
        case 'welcome':
          switch (selectedTemplateValue.toLowerCase()) {
            case 'fresher':
              newTemplateText = `Hi ${subscriberName}, this is your first step in your career.`;
              break;
            case 'experienced':
              newTemplateText = `Hi ${subscriberName}, we need an experienced professional like you.`;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
  
      // Append payload to template text
      if (selectedPayload) {
        newTemplateText += `, with regards ${selectedPayload}`;
      }
  
      // Concatenate the new template text with the combined template text
      //we concatenate each new template text to a combinedTemplateText string variable. 
      //This variable accumulates all the individual template texts for each 
      // selected subscriber.
      combinedTemplateText += newTemplateText + '\n';
    });
  
    // Log the combined template text
    console.log("New template text:", combinedTemplateText);
  
    // Update the template text state with the combined template text
    setTemplateText(combinedTemplateText);
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
                <input type="text" id="templateText" className="form-control" value={templateText} readOnly />
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
