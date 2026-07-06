import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyJob = () => {
  const { id } = useParams();
  const { jobs, userData, setShowUserLogin, token, backendUrl, userApplications, fetchUserApplications } = useAppContext();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const found = jobs.find((j) => j._id === id);
    if (found) {
      setJobData(found);
      const related = jobs.filter(
        (j) => j.category === found.category && j._id !== found._id
      ).slice(0, 4);
      setRelatedJobs(related);
    }
    window.scrollTo(0, 0);
  }, [id, jobs]);

  // Check if candidate has already applied to this job
  useEffect(() => {
    if (userApplications.length > 0 && id) {
      const hasApplied = userApplications.some((app) => app.jobId && app.jobId._id === id);
      setApplied(hasApplied);
    }
  }, [id, userApplications]);

  const handleApply = async () => {
    if (!userData) {
      setShowUserLogin(true);
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/apply`,
        { jobId: id },
        { headers: { token } }
      );
      if (data.success) {
        setApplied(true);
        toast.success("Applied successfully!");
        fetchUserApplications(); // Refresh applied jobs list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!jobData) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="apply-job-page">
        <div className="apply-job-container">
          {/* Left: Job Details */}
          <div className="job-details-main">
            {/* Job Header Card */}
            <div className="job-header-card">
              <div className="job-header-top">
                <img
                  src={`${backendUrl}/uploads/${jobData.companyId.image}`}
                  alt={jobData.companyId.name}
                  className="job-company-logo-lg"
                />
                <div className="job-header-info">
                  <h1>{jobData.title}</h1>
                  <div className="job-meta">
                    <span>
                      <img src={assets.suitcase_icon} alt="" />
                      {jobData.companyId.name}
                    </span>
                    <span>
                      <img src={assets.location_icon} alt="" />
                      {jobData.location}
                    </span>
                    <span>
                      <img src={assets.person_icon} alt="" />
                      {jobData.level}
                    </span>
                    <span>
                      <img src={assets.money_icon} alt="" />
                      CTC: {Math.floor(jobData.salary / 1000)}k - {Math.floor(jobData.salary / 1000) + 20}k
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`btn-apply-now ${applied ? "applied" : ""}`}
                onClick={handleApply}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply Now"}
              </button>
            </div>

            {/* Job Description */}
            <div className="job-description-card">
              <h2>Job Description</h2>
              <div
                className="job-desc-content"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
              <button
                className={`btn-apply-now ${applied ? "applied" : ""}`}
                onClick={handleApply}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>

          {/* Right: Related Jobs */}
          <div className="related-jobs-sidebar">
            <h3>More jobs from {jobData.companyId.name}</h3>
            <div className="related-jobs-list">
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p>No related jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
