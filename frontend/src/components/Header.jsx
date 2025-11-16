import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isRecruiter, isSeeker } from '../auth/roleUtils';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h1 style={styles.logoText}>JobConnect</h1>
        </Link>

        <nav style={styles.nav}>
          <Link to="/jobs" style={styles.navLink}>Jobs</Link>
          
          {isAuthenticated ? (
            <>
              {isSeeker(user) && (
                <>
                  <Link to="/seeker/dashboard" style={styles.navLink}>Dashboard</Link>
                  <Link to="/seeker/profile" style={styles.navLink}>Profile</Link>
                </>
              )}
              
              {isRecruiter(user) && (
                <>
                  <Link to="/recruiter/dashboard" style={styles.navLink}>Dashboard</Link>
                  <Link to="/recruiter/post-job" style={styles.navLink}>Post Job</Link>
                </>
              )}
              
              <Link to="/events" style={styles.navLink}>Events</Link>
              
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.fullName}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.navLinkPrimary}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    textDecoration: 'none',
    color: 'white'
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'opacity 0.2s'
  },
  navLinkPrimary: {
    color: '#2563eb',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255,255,255,0.3)'
  },
  userName: {
    fontSize: '0.9rem'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s'
  }
};

export default Header;

