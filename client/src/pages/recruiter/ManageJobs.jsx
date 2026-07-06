import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/recruiter/Sidebar";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const ManageJobs = () => {
  const navigate = useNavigate();
  const { companyToken, backendUrl } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobsAndApplicants = async () => {
    try {
      if (!companyToken) return;

      const headers = { token: companyToken };

      const [jobsRes, applicantsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/company/jobs`, { headers }),
        axios.get(`${backendUrl}/api/company/applicants`, { headers }),
      ]);

      if (jobsRes.data.success) {
        setJobs(jobsRes.data.jobs);
      }
      if (applicantsRes.data.success) {
        setApplicants(applicantsRes.data.applications);
      }
    } catch (error) {
      console.error("Manage Jobs Load Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApplicants();
  }, [companyToken, backendUrl]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/company/delete-job/${id}`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setJobs(jobs.filter((job) => job._id !== id));
        alert("Job deleted successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleVisibilityToggle = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        setJobs(jobs.map((job) => (job._id === id ? { ...job, visible: !job.visible } : job)));
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <>
      <RecruiterNavbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="manage-jobs-page">
            <div className="manage-jobs-header">
              <h2>Manage Jobs</h2>
              <button className="btn-add-job" onClick={() => navigate("/dashboard/add-job")}>
                + Add New Job
              </button>
            </div>

            <table className="manage-jobs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Applicants</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => {
                  const jobApplicantsCount = applicants.filter(
                    (app) => app.jobId && app.jobId._id === job._id
                  ).length;

                  return (
                    <tr key={job._id}>
                      <td>{idx + 1}</td>
                      <td>{job.title}</td>
                      <td>{formatDate(job.createdAt)}</td>
                      <td>{job.location}</td>
                      <td>
                        <button
                          className="btn-view-applicants"
                          onClick={() =>
                            navigate(`/dashboard/view-applications/${job._id}`)
                          }
                        >
                          {jobApplicantsCount}
                        </button>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          className="visibility-checkbox"
                          checked={job.visible}
                          onChange={() => handleVisibilityToggle(job._id)}
                        />
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-edit"
                            onClick={() => navigate(`/dashboard/edit-job/${job._id}`)}
                          >
                            <img src={assets.edit_icon} alt="Edit" />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(job._id)}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>


            {jobs.length === 0 && (
              <div className="no-jobs-message">
                <p>No jobs posted yet. <span onClick={() => navigate("/dashboard/add-job")}>Post a job now</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageJobs;
