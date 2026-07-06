import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JobCategories, JobLocations } from "../../assets/assets";
import Sidebar from "../../components/recruiter/Sidebar";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companyToken, backendUrl } = useAppContext();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(true);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Fetch job details on load
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (data.success) {
          setTitle(data.job.title);
          setLocation(data.job.location);
          setCategory(data.job.category);
          setLevel(data.job.level);
          setSalary(data.job.salary);
          
          if (quillRef.current) {
            quillRef.current.root.innerHTML = data.job.description;
          }
        }
      } catch (error) {
        alert("Failed to load job details.");
        navigate("/dashboard/manage-jobs");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id, backendUrl, navigate]);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter job description...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current?.root?.innerHTML || "";

    if (!description || description === "<p><br></p>") {
      alert("Please enter a job description.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/edit-job`,
        { id, title, description, location, category, level, salary: Number(salary) },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        alert("Job updated successfully!");
        navigate("/dashboard/manage-jobs");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  return (
    <>
      <RecruiterNavbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="add-job-page">
            <h2 className="dashboard-title" style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "700" }}>Edit Job</h2>
            <form className="add-job-form" onSubmit={handleSubmit}>
              {/* Job Title */}
              <div className="add-job-field">
                <label>Job Title</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Job Description - Quill */}
              <div className="add-job-field">
                <label>Job Description</label>
                <div ref={editorRef} className="quill-editor-container" />
              </div>

              {/* 3-column row: Category, Location, Level */}
              <div className="add-job-row">
                <div className="add-job-field">
                  <label>Job Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {JobCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="add-job-field">
                  <label>Job Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {JobLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="add-job-field">
                  <label>Job Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option value="Beginner Level">Beginner Level</option>
                    <option value="Intermediate Level">Intermediate Level</option>
                    <option value="Senior Level">Senior Level</option>
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div className="add-job-field add-job-salary">
                <label>Job Salary</label>
                <input
                  type="number"
                  placeholder="2500"
                  min="0"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-add-job-submit">
                SAVE CHANGES
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJob;
