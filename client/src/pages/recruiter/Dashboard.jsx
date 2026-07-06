import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/recruiter/Sidebar";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, companyToken, backendUrl } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        console.error("Dashboard Load Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [companyToken, backendUrl]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const stats = [
    { label: "Total Jobs Posted", value: jobs.length, icon: assets.suitcase_icon },
    { label: "Total Applicants", value: applicants.length, icon: assets.person_tick_icon },
  ];

  return (
    <>
      <RecruiterNavbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-page">
            <div className="dashboard-welcome">
              <h2>Welcome back, {companyData?.name || "Recruiter"}! 👋</h2>
              <p>Here's an overview of your job postings and applicants.</p>
            </div>

            <div className="dashboard-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <img src={stat.icon} alt={stat.label} />
                  <div>
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-recent">
              <div className="dashboard-recent-header">
                <h3>Recent Job Postings</h3>
                <button onClick={() => navigate("/dashboard/manage-jobs")}>View All</button>
              </div>
              <table className="manage-jobs-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 3).map((job) => {
                    const jobApplicantsCount = applicants.filter(
                      (app) => app.jobId && app.jobId._id === job._id
                    ).length;

                    return (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.location}</td>
                        <td>
                          <button
                            className="btn-view-applicants"
                            onClick={() => navigate(`/dashboard/view-applications/${job._id}`)}
                          >
                            {jobApplicantsCount} applicants
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
