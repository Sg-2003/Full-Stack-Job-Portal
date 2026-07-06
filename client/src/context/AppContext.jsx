import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  
  // Recruiter Auth States
  const [companyToken, setCompanyToken] = useState(localStorage.getItem("companyToken") || null);
  const [companyData, setCompanyData] = useState(null);
  
  // User Auth States
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // Fetch Public Jobs from Backend
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Fetch Jobs Error:", error.message);
    }
  };

  // Fetch Candidate Profile Data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { token }
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Fetch User Data Error:", error.message);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // Fetch Recruiter Company Data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/data`, {
        headers: { token: companyToken }
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        setCompanyToken(null);
        localStorage.removeItem("companyToken");
      }
    } catch (error) {
      console.error("Fetch Company Data Error:", error.message);
      setCompanyToken(null);
      localStorage.removeItem("companyToken");
    }
  };

  // Fetch Applied Jobs of Candidate
  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/applications`, {
        headers: { token }
      });
      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.error("Fetch User Applications Error:", error.message);
    }
  };

  // Initial jobs fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserApplications();
    } else {
      setUserData(null);
      setUserApplications([]);
    }
  }, [token]);

  // Fetch company data when recruiter token changes
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    } else {
      setCompanyData(null);
    }
  }, [companyToken]);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        token,
        setToken,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        showUserLogin,
        setShowUserLogin,
        fetchJobs,
        fetchUserData,
        fetchUserApplications,
        fetchCompanyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
