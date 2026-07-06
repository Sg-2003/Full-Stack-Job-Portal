import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const RecruiterLogin = () => {
  const { setShowRecruiterLogin, setCompanyData, setCompanyToken, backendUrl } = useAppContext();
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, { email, password });
        if (data.success) {
          setCompanyToken(data.token);
          setCompanyData(data.company);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          alert(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);

        const { data } = await axios.post(`${backendUrl}/api/company/register`, formData);
        if (data.success) {
          setCompanyToken(data.token);
          setCompanyData(data.company);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="recruiter-login-overlay">
      <div className="recruiter-login-modal">
        <div className="modal-header">
          <img src={assets.logo} alt="Logo" className="modal-logo" />
          <h2>{state === "Login" ? "Recruiter Login" : "Sign Up"}</h2>
          <p>Welcome back! Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="form-group">
              <div className="upload-company-img">
                <label htmlFor="recruiterImage">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload_area}
                    alt="Upload"
                    className="upload-img"
                  />
                  <span>Upload Company Logo</span>
                </label>
                <input
                  type="file"
                  id="recruiterImage"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>
            </div>
          )}

          {state === "Sign Up" && (
            <div className="form-group">
              <div className="input-wrapper">
                <img src={assets.person_icon} alt="" />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <img src={assets.email_icon} alt="" />
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <img src={assets.lock_icon} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            {state === "Login" ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="toggle-state">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span onClick={() => setState("Sign Up")}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("Login")}>Login</span>
            </>
          )}
        </p>

        <button className="modal-close" onClick={() => setShowRecruiterLogin(false)}>
          <img src={assets.cross_icon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default RecruiterLogin;
