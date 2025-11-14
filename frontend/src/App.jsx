import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./auth/PrivateRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Job Seeker Pages
import Dashboard from "./pages/seeker/Dashboard";
import Profile from "./pages/seeker/Profile";

// Recruiter Pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import PostJob from "./pages/recruiter/PostJob";
import PostedJobs from "./pages/recruiter/PostedJobs";

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Job Seeker Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter"
          element={
            <PrivateRoute role="RECRUITER">
              <RecruiterDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/recruiter/post-job"
          element={
            <PrivateRoute role="RECRUITER">
              <PostJob />
            </PrivateRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <PrivateRoute role="RECRUITER">
              <PostedJobs />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
