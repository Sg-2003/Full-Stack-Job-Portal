import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { jobs, searchFilter, isSearched, setSearchFilter, setIsSearched } = useAppContext();
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const jobsPerPage = 6;

  useEffect(() => {
    let result = jobs;

    if (isSearched) {
      if (searchFilter.title) {
        result = result.filter((job) =>
          job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        );
      }
      if (searchFilter.location) {
        result = result.filter((job) =>
          job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
        );
      }
    }

    if (selectedCategories.length > 0) {
      result = result.filter((job) => selectedCategories.includes(job.category));
    }
    if (selectedLocations.length > 0) {
      result = result.filter((job) => selectedLocations.includes(job.location));
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [jobs, searchFilter, isSearched, selectedCategories, selectedLocations]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleLocation = (loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="job-listing-section">
      <div className="job-listing-container">
        {/* Filter Sidebar */}
        <div className={`filter-sidebar ${showFilter ? "show" : ""}`}>
          {/* Search filter tags */}
          {isSearched && (searchFilter.title || searchFilter.location) && (
            <div className="active-filters">
              {searchFilter.title && (
                <span className="filter-tag">
                  {searchFilter.title}
                  <button
                    onClick={() => {
                      setSearchFilter((prev) => ({ ...prev, title: "" }));
                    }}
                  >
                    <img src={assets.cross_icon} alt="Remove" />
                  </button>
                </span>
              )}
              {searchFilter.location && (
                <span className="filter-tag">
                  {searchFilter.location}
                  <button
                    onClick={() => {
                      setSearchFilter((prev) => ({ ...prev, location: "" }));
                    }}
                  >
                    <img src={assets.cross_icon} alt="Remove" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Category Filter */}
          <div className="filter-group">
            <h3>Search by Categories</h3>
            {JobCategories.map((cat) => (
              <label key={cat} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <h3>Search by Location</h3>
            {JobLocations.map((loc) => (
              <label key={loc} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc)}
                  onChange={() => toggleLocation(loc)}
                />
                <span>{loc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="job-cards-section">
          <div className="job-listing-header" id="job-list">
            <div>
              <h3 className="job-listing-title">Latest jobs</h3>
              <p className="job-listing-subtitle">Get your desired job from top companies</p>
            </div>
            <button
              className="btn-filter-toggle"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              {showFilter ? "Close Filters" : "Filters"}
            </button>
          </div>

          <div className="job-cards-grid">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="no-jobs">
                <p>No jobs found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <img src={assets.left_arrow_icon} alt="Previous" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                <img src={assets.right_arrow_icon} alt="Next" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
