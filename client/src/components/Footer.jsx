import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="footer">
      <img src={assets.logo} alt="Job Portal Logo" className="footer-logo-img" />
      <p className="footer-copyright">Copyright @JobPortal.com | All right reserved.</p>
      <div className="footer-socials-new">
        <img width="38" src={assets.facebook_icon} alt="Facebook" />
        <img width="38" src={assets.twitter_icon} alt="Twitter" />
        <img width="38" src={assets.instagram_icon} alt="Instagram" />
      </div>
    </footer>
  );
};

export default Footer;
