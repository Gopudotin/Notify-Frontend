// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import NotificationForm from './components/NotificationForm';
import SubscriberView from './components/SubscriberView';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotificationForm />} />
        <Route path="/subscriber/:id" element={<SubscriberView />} />
      </Routes>
    </Router>
  );
};

export default App;
