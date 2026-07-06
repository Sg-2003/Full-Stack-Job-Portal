import express from "express";
import {
  registerUser,
  loginUser,
  getUserData,
  applyForJob,
  getUserApplications,
  uploadResume,
} from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected User Routes
router.get("/data", protectUser, getUserData);
router.post("/apply", protectUser, applyForJob);
router.get("/applications", protectUser, getUserApplications);
router.post("/upload-resume", protectUser, upload.single("resume"), uploadResume);

export default router;
