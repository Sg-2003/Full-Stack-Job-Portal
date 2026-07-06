import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobs,
  getCompanyJobApplicants,
  updateApplicationStatus,
  deleteJob,
  updateJobVisibility,
  editJob,
} from "../controllers/companyController.js";
import { protectCompany } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

// Public Routes
router.post("/register", upload.single("image"), registerCompany);
router.post("/login", loginCompany);

// Protected Recruiter Routes
router.get("/data", protectCompany, getCompanyData);
router.post("/post-job", protectCompany, postJob);
router.post("/edit-job", protectCompany, editJob);
router.get("/jobs", protectCompany, getCompanyJobs);
router.get("/applicants", protectCompany, getCompanyJobApplicants);
router.post("/change-status", protectCompany, updateApplicationStatus);
router.delete("/delete-job/:id", protectCompany, deleteJob);
router.post("/change-visibility", protectCompany, updateJobVisibility);


export default router;
