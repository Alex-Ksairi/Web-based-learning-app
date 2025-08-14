import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';

import '../src/assets/scss/style.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;