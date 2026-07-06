import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

const JobApplication = mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
