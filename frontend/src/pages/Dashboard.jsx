import '../assets/scss/pages/_dashboard.scss';
import Header from "../components/Header";
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';

import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const baseURL = "http://localhost:8000";

  useEffect(() => {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('session_token');

      if (userId && token) {
          fetch(`${baseURL}/routes/auth.php?action=getUserDetails&id=${userId}`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setUser(data.user)
            }
          })
          .catch(err => console.error(err));
      }
  }, []);

  return (
    <div className="dashboard">
      <Header user={user} />

      <main>
        {user?.role && user.role.trim().toLowerCase() === "admin" ? (
          <>
            <AdminDashboard/>
          </>
        ) : (
          <>
            <UserDashboard/>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;