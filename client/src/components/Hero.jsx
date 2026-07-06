import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useAppContext();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearchFilter({ title, location });
    setIsSearched(true);
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Over 10,000+ jobs to apply
        </h1>
        <p>Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!</p>

        <div className="hero-search">
          <div className="search-input-group">
            <img src={assets.search_icon} alt="Search" />
            <input
              type="text"
              placeholder="Search for jobs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-input-group">
            <img src={assets.location_icon} alt="Location" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="trusted-companies">
          <p>Trusted by</p>
          <div className="company-logos">
            <img src={assets.microsoft_logo} alt="Microsoft" />
            <img src={assets.walmart_logo} alt="Walmart" />
            <img src={assets.accenture_logo} alt="Accenture" />
            <img src={assets.samsung_logo} alt="Samsung" />
            <img src={assets.amazon_logo} alt="Amazon" />
            <img src={assets.adobe_logo} alt="Adobe" />
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src={assets.app_main_img} alt="Job Portal App" />
      </div>
    </div>
  );
};

export default Hero;
