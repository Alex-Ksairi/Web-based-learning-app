import { useNavigate, useLocation } from "react-router-dom";
import '../assets/scss/layout/_header.scss';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("session_token");
    navigate("/login");
  };

  const userInitials = user?.name?.substring(0, 1) + user?.surname?.substring(0, 1);

  return (
    <header className="header">
      <a href="/">
        <div className="header-left">
          <h2>{userInitials || 'W'}</h2>
        </div>
      </a>
      <div className="header-right">
        {location.pathname !== "/edit-profile" && (
          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
        )}
        {location.pathname === "/edit-profile" && (
          <button onClick={() => navigate("/")}>Cancel</button>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;