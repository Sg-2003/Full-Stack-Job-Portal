import React from "react";
import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download-section">
      <div className="app-download-container">
        <div className="app-download-content">
          <h2>
            Download Mobile App For Better Experience
          </h2>
          <div className="store-buttons">
            <a href="#" className="store-btn">
              <img src={assets.play_store} alt="Google Play" />
            </a>
            <a href="#" className="store-btn">
              <img src={assets.app_store} alt="App Store" />
            </a>
          </div>
        </div>
        <div className="app-download-image">
          <img src={assets.app_main_img} alt="App Preview" />
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
