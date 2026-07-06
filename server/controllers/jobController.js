import Job from "../models/Job.js";

// @desc    Get all jobs (public)
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { title, location } = req.query;
    let query = { visible: true };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query).populate("companyId", "name email image");
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Get Jobs Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("companyId", "name email image");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error("Get Job By ID Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
