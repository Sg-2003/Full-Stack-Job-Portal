import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { backendUrl } = useAppContext();

  return (
    <div className="job-card" onClick={() => { navigate(`/apply-job/${job._id}`); window.scrollTo(0, 0); }}>
      <div className="job-card-top">
        <img
          src={`${backendUrl}/uploads/${job.companyId.image}`}
          alt={job.companyId.name}
          className="job-company-logo"
          onError={(e) => {
            e.target.src = assets.company_icon;
          }}
        />
      </div>
      <div className="job-card-body">
        <h3 className="job-title">{job.title}</h3>
        <div className="job-tags">
          <span className="tag tag-location">{job.location}</span>
          <span className="tag tag-level">{job.level}</span>
        </div>
        <p className="job-description">
          {job.description.replace(/<[^>]+>/g, "").slice(0, 100)}...
        </p>
      </div>
      <div className="job-card-footer">
        <button
          className="btn-apply"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
        >
          Apply Now
        </button>
        <button
          className="btn-learn-more"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
