import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register user
// @route   POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        resume: user.resume,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Register User Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        resume: user.resume,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get authenticated user data
// @route   GET /api/user/data
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/user/apply
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if user has already applied
    const alreadyApplied = await JobApplication.findOne({ jobId, userId: req.userId });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    const application = await JobApplication.create({
      jobId,
      userId: req.userId,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error("Apply Job Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user applications
// @route   GET /api/user/applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.userId }).populate({
      path: "jobId",
      populate: { path: "companyId", select: "name email image" },
    });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get User Applications Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / Update user resume
// @route   POST /api/user/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.resume = file.filename;
    await user.save();

    res.json({ success: true, message: "Resume uploaded successfully", resume: user.resume });
  } catch (error) {
    console.error("Upload Resume Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
