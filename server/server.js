import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);

import fs from "fs";
app.get("/api/debug-files", (req, res) => {
  try {
    const filesInDir = fs.readdirSync(__dirname);
    const filesInParent = fs.existsSync(path.join(__dirname, "..")) ? fs.readdirSync(path.join(__dirname, "..")) : [];
    res.json({
      __dirname,
      filesInDir,
      filesInParent,
      existsUploadsDir: fs.existsSync(path.join(__dirname, "uploads")),
      existsParentUploadsDir: fs.existsSync(path.join(__dirname, "..", "uploads")),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic health check route
app.get("/", (req, res) => {
  res.send("Job Portal API is running");
});

// Start Server (only in local dev, not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
