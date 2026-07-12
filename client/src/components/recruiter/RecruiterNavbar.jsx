import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const RecruiterNavbar = () => {
  const { companyData, setCompanyData, setCompanyToken, backendUrl } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCompanyData(null);
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    navigate("/");
  };

  return (
    <nav className="recruiter-navbar">
      <div className="recruiter-navbar-container">
        <Link to="/">
          <img src={assets.logo} alt="Job Portal" className="navbar-logo" />
        </Link>
        <div className="recruiter-nav-right">
          {companyData && (
            <div className="recruiter-profile">
              <p>Welcome, {companyData.name}</p>
              <div className="recruiter-avatar">
                <img
                  src={
                    companyData.image
                      ? companyData.image.startsWith("http")
                        ? companyData.image
                        : `${backendUrl}/uploads/${companyData.image}`
                      : assets.company_icon
                  }
                  alt="Company"
                  onError={(e) => {
                    e.target.src = assets.company_icon;
                  }}
                />
                <div className="recruiter-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;
