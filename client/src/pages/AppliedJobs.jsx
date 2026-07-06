import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const AppliedJobs = () => {
  const { userData, token, backendUrl, userApplications, fetchUserData } = useAppContext();
  const navigate = useNavigate();

  const handleResumeUpload = async (file) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post(`${backendUrl}/api/user/upload-resume`, formData, {
        headers: { token },
      });

      if (data.success) {
        alert("Resume uploaded successfully!");
        fetchUserData(); // Refresh user details (updates resume path)
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") return "status-accepted";
    if (status === "Rejected") return "status-rejected";
    return "status-pending";
  };

  return (
    <>
      <Navbar />
      <div className="applied-jobs-page">
        <div className="applied-jobs-container">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-img-wrapper">
                <img
                  src={
                    userData?.image
                      ? userData.image.startsWith("http")
                        ? userData.image
                        : `${backendUrl}/uploads/${userData.image}`
                      : assets.profile_img
                  }
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <h2>Hi, {userData?.name || "Candidate"}</h2>
              <p className="profile-subtitle">Ready to make your next big career move</p>

              <div className="resume-section">
                <h3>Resume</h3>
                <div className="resume-options">
                  <label className="resume-option">
                    <input type="radio" name="resume" checked={!!userData?.resume} readOnly />
                    <img src={userData?.resume ? assets.resume_selected : assets.resume_not_selected} alt="" />
                    <span>Resume</span>
                  </label>
                  <label className="resume-option">
                    <input type="radio" name="resume" checked={!userData?.resume} readOnly />
                    <img src={!userData?.resume ? assets.resume_selected : assets.resume_not_selected} alt="" />
                    <span>No Resume</span>
                  </label>
                </div>
                
                <input
                  type="file"
                  id="resumeUpload"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleResumeUpload(e.target.files[0])}
                />
                
                <button
                  className="btn-upload-resume"
                  onClick={() => document.getElementById("resumeUpload").click()}
                >
                  <img src={assets.profile_upload_icon} alt="" />
                  {userData?.resume ? "Change Resume" : "Upload Resume"}
                </button>
                {userData?.resume && (
                  <a
                    href={`${backendUrl}/uploads/${userData.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "block", marginTop: "10px", fontSize: "13px", color: "var(--primary)" }}
                  >
                    View Current Resume
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Applied Jobs Table */}
          <div className="applied-jobs-table-section">
            <h2>Jobs Applied</h2>
            <table className="applied-jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((app, idx) => {
                  if (!app.jobId) return null;
                  
                  return (
                    <tr key={idx}>
                      <td>
                        <div className="company-cell">
                          <img
                            src={`${backendUrl}/uploads/${app.jobId.companyId.image}`}
                            alt={app.jobId.companyId.name}
                          />
                          <span>{app.jobId.companyId.name}</span>
                        </div>
                      </td>
                      <td>{app.jobId.title}</td>
                      <td>{app.jobId.location}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {userApplications.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                <p>You haven't applied for any jobs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppliedJobs;
