import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const Login = () => {
  const { setShowUserLogin, setUserData, setToken, backendUrl } = useAppContext();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          setToken(data.token);
          setUserData(data.user);
          localStorage.setItem("token", data.token);
          setShowUserLogin(false);
        } else {
          alert(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (data.success) {
          setToken(data.token);
          setUserData(data.user);
          localStorage.setItem("token", data.token);
          setShowUserLogin(false);
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
          <h2>{state === "Login" ? "User Login" : "Sign Up"}</h2>
          <p>{state === "Login" ? "Welcome back! Please sign in." : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="form-group">
              <div className="input-wrapper">
                <img src={assets.person_icon} alt="" />
                <input
                  type="text"
                  placeholder="Full Name"
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
            <>Don't have an account? <span onClick={() => setState("Sign Up")}>Sign Up</span></>
          ) : (
            <>Already have an account? <span onClick={() => setState("Login")}>Login</span></>
          )}
        </p>

        <button className="modal-close" onClick={() => setShowUserLogin(false)}>
          <img src={assets.cross_icon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Login;
