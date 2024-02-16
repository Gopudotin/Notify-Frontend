import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNotificationForm from './components/CreateNotificationForm';
import SubscriberDetails from './components/SubscriberDetails';
import ViewSubscribersPage from './components/ViewSubscribersPage';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<CreateNotificationForm />} />
          <Route exact path="/view-subscribers" element={<ViewSubscribersPage />} />
          <Route path="/subscriber/:id" element={<SubscriberDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
