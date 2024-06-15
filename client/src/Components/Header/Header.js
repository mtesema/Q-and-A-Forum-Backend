import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App"; // Import UserContext for accessing user state
import images from "../../Resource/Images"; // Replace with your image import path
import "./Header.css"; // Your CSS file for styling


function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

    const handleProfile = () => {
      navigate("/profile");
    };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token"); // Remove token from localStorage
      setUser(null); // Clear user context
      navigate("/register"); // Redirect to register page after logout
    }
  };

  const homepageHandler = () => {
    navigate("/");
  };

  const loginPageHandler = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div
        className="header-logo"
        onClick={user ? homepageHandler : loginPageHandler}
      >
        <img src={images.HeaderLogo} alt="Evangadi Logo" />
      </div>
      <div className="left-header-wrapper">
        <nav className="header-nav">
          <ul className="header-nav-list">
            <li className="header-nav-item">
              <Link to="/login">Home</Link>
            </li>
            <li className="header-nav-item">
              <Link to="/login">How it works?</Link>
            </li>
          </ul>
        </nav>
        <div className="header-buttons">
          {user ? (
            <button className="header-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="header-button">
              Login
            </Link>
          )}
          <Link to="/register" className="header-button">
            Register
          </Link>
        </div>

        {user && (
          <div className="header-profile" onClick={handleProfile}>
            <img
              src={images.avatar}
              alt="Profile"
              className="header-profile-image"
            />
            <span className="header-profile-name">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
