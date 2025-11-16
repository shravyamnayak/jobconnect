import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './auth/PrivateRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Seeker Pages
import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerProfile from './pages/seeker/Profile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob from './pages/recruiter/PostJob';

// Common Pages
import JobList from './pages/common/JobList';
import EventList from './pages/common/EventList';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/jobs" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/jobs" element={<JobList />} />
              
              <Route path="/seeker/dashboard" element={
                <PrivateRoute roles={['SEEKER']}>
                  <SeekerDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/seeker/profile" element={
                <PrivateRoute roles={['SEEKER']}>
                  <SeekerProfile />
                </PrivateRoute>
              } />
              
              <Route path="/recruiter/dashboard" element={
                <PrivateRoute roles={['RECRUITER']}>
                  <RecruiterDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/recruiter/post-job" element={
                <PrivateRoute roles={['RECRUITER']}>
                  <PostJob />
                </PrivateRoute>
              } />
              
              <Route path="/events" element={
                <PrivateRoute>
                  <EventList />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;