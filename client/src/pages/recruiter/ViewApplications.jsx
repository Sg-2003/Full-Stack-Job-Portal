import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/recruiter/Sidebar";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ViewApplications = () => {
  const { companyToken, backendUrl } = useAppContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      if (!companyToken) return;
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [companyToken, backendUrl]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id: appId, status: newStatus },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        toast.success(`Application status set to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <>
      <RecruiterNavbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="view-applications-page">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => {
                  if (!app.jobId || !app.userId) return null;
                  return (
                    <tr key={app._id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="applicant-cell">
                          <img
                            src={
                              app.userId.image
                                ? app.userId.image.startsWith("http")
                                  ? app.userId.image
                                  : `${backendUrl}/uploads/${app.userId.image}`
                                : assets.profile_img
                            }
                            alt={app.userId.name}
                            className="applicant-img"
                            onError={(e) => {
                              e.target.src = assets.profile_img;
                            }}
                          />
                          <span>{app.userId.name}</span>
                        </div>
                      </td>
                      <td>{app.jobId.title}</td>
                      <td>{app.jobId.location}</td>
                      <td>
                        {app.userId.resume ? (
                          <a
                            href={`${backendUrl}/uploads/${app.userId.resume}`}
                            className="resume-link"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src={assets.resume_download_icon} alt="Resume" />
                            Resume
                          </a>
                        ) : (
                          <span className="no-resume">No Resume</span>
                        )}
                      </td>
                      <td>
                        <select
                          className={`status-select status-${app.status.toLowerCase()}`}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {applications.length === 0 && (
              <div className="no-applications">
                <p>No applications received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplications;
