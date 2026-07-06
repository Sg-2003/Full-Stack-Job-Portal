import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { setShowRecruiterLogin, userData, setUserData, setShowUserLogin, setToken, backendUrl } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img src={assets.logo} alt="Job Portal Logo" className="navbar-logo" />
        </Link>

        <div className="navbar-right">
          {userData ? (
            <div className="user-menu">
              <img
                src={
                  userData?.image
                    ? userData.image.startsWith("http")
                      ? userData.image
                      : `${backendUrl}/uploads/${userData.image}`
                    : assets.profile_img
                }
                alt="Profile"
                className="profile-avatar"
              />
              <div className="user-dropdown">
                <button onClick={() => navigate("/applications")}>Applied Jobs</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="navbar-actions">
              <button
                className="btn-recruiter-login"
                onClick={() => setShowRecruiterLogin(true)}
              >
                Recruiter Login
              </button>
              <button
                className="btn-login"
                onClick={() => setShowUserLogin(true)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
