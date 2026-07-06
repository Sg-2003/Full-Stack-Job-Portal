import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { JobCategories, JobLocations } from "../../assets/assets";
import Sidebar from "../../components/recruiter/Sidebar";
import RecruiterNavbar from "../../components/recruiter/RecruiterNavbar";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddJob = () => {
  const navigate = useNavigate();
  const { companyToken, backendUrl } = useAppContext();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

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
      toast.error("Please enter a job description.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, category, level, salary: Number(salary) },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success("Job posted successfully!");
        navigate("/dashboard/manage-jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <RecruiterNavbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <div className="add-job-page">
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
                ADD
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJob;
