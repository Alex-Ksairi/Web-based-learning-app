import { Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';

const DynamicTitleUpdater = () => {
  const location = useLocation();

  React.useEffect(() => {
    let newTitle = 'Learning App';

    switch (location.pathname) {
      case '/':
        newTitle = 'Dashboard | Learning App';
        break;
      case '/register':
        newTitle = 'Register | Learning App';
        break;
      case '/login':
        newTitle = 'Login | Learning App';
        break;
      case '/edit-profile':
        newTitle = 'Edit Profile | Learning App';
        break;
      default:
        newTitle = 'Page Not Found | Learning App';
        break;
    }

    document.title = newTitle;
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <div>
      <DynamicTitleUpdater />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </div>
  );
};

export default App;