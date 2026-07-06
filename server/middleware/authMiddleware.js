import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

// Middleware to protect user routes
export const protectUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("User Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

// Middleware to protect company/recruiter routes
export const protectCompany = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.companyId = decoded.id;
    next();
  } catch (error) {
    console.error("Company Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: "Token verification failed" });
  }
};
