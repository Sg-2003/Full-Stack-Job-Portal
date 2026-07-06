import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RecruiterLogin from "./components/RecruiterLogin";
import Login from "./components/Login";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import AppliedJobs from "./pages/AppliedJobs";
import Dashboard from "./pages/recruiter/Dashboard";
import AddJob from "./pages/recruiter/AddJob";
import ManageJobs from "./pages/recruiter/ManageJobs";
import ViewApplications from "./pages/recruiter/ViewApplications";
import EditJob from "./pages/recruiter/EditJob";

function App() {
  const { showRecruiterLogin, companyToken, showUserLogin } = useAppContext();

  return (
    <div className="app">
      {showRecruiterLogin && <RecruiterLogin />}
      {showUserLogin && <Login />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<AppliedJobs />} />

        {/* Recruiter Routes */}
        <Route
          path="/dashboard"
          element={companyToken ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/add-job"
          element={companyToken ? <AddJob /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/edit-job/:id"
          element={companyToken ? <EditJob /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/manage-jobs"
          element={companyToken ? <ManageJobs /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/view-applications"
          element={companyToken ? <ViewApplications /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/view-applications/:id"
          element={companyToken ? <ViewApplications /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
