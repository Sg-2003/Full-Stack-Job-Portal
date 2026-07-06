import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new company/recruiter
// @route   POST /api/company/register
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!name || !email || !password || !file) {
      return res.status(400).json({ success: false, message: "Please fill all fields and upload a logo" });
    }

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ success: false, message: "Company email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: file.filename, // Store filename of uploaded logo
    });

    res.status(201).json({
      success: true,
      token: generateToken(company._id),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
    });
  } catch (error) {
    console.error("Register Company Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login company/recruiter
// @route   POST /api/company/login
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      token: generateToken(company._id),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
    });
  } catch (error) {
    console.error("Login Company Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in company data
// @route   GET /api/company/data
export const getCompanyData = async (req, res) => {
  try {
    const company = await Company.findById(req.companyId).select("-password");
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post a new job
// @route   POST /api/company/post-job
export const postJob = async (req, res) => {
  try {
    const { title, description, location, category, level, salary } = req.body;

    if (!title || !description || !location || !category || !level || !salary) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      category,
      level,
      salary,
      companyId: req.companyId,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("Post Job Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get jobs posted by company
// @route   GET /api/company/jobs
export const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.companyId }).populate("companyId", "name email image");
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Get Company Jobs Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for company's jobs
// @route   GET /api/company/applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    // Find all jobs posted by the company
    const jobs = await Job.find({ companyId: req.companyId });
    const jobIds = jobs.map((job) => job._id);

    // Find all applications for these jobs
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title location category level salary")
      .populate("userId", "name email resume image");

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get Company Applicants Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change application status (Accept / Reject)
// @route   POST /api/company/change-status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // Application ID and new status

    if (!id || !status || !["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application ID or status" });
    }

    const application = await JobApplication.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Check if job belongs to recruiter company
    if (application.jobId.companyId.toString() !== req.companyId) {
      return res.status(401).json({ success: false, message: "Not authorized to modify this application" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/company/delete-job/:id
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if job belongs to recruiter company
    if (job.companyId.toString() !== req.companyId) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this job" });
    }

    // Delete all applications related to this job
    await JobApplication.deleteMany({ jobId: id });

    // Delete the job
    await Job.findByIdAndDelete(id);

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle job visibility
// @route   POST /api/company/change-visibility
export const updateJobVisibility = async (req, res) => {
  try {
    const { id } = req.body; // Job ID

    if (!id) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if job belongs to recruiter company
    if (job.companyId.toString() !== req.companyId) {
      return res.status(401).json({ success: false, message: "Not authorized to modify this job" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Update Visibility Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit a job
// @route   POST /api/company/edit-job
export const editJob = async (req, res) => {
  try {
    const { id, title, description, location, category, level, salary } = req.body;

    if (!id || !title || !description || !location || !category || !level || !salary) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if job belongs to recruiter company
    if (job.companyId.toString() !== req.companyId) {
      return res.status(401).json({ success: false, message: "Not authorized to modify this job" });
    }

    job.title = title;
    job.description = description;
    job.location = location;
    job.category = category;
    job.level = level;
    job.salary = salary;

    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Edit Job Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



