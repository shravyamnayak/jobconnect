import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { auth, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          JobConnect
        </Link>
        
        <nav style={styles.nav}>
          <Link to="/jobs" style={styles.link}>Jobs</Link>
          
          {auth ? (
            <>
              {hasRole('SEEKER') && (
                <Link to="/seeker/dashboard" style={styles.link}>Dashboard</Link>
              )}
              
              {hasRole('RECRUITER') && (
                <>
                  <Link to="/recruiter/dashboard" style={styles.link}>Dashboard</Link>
                  <Link to="/recruiter/post-job" style={styles.link}>Post Job</Link>
                </>
              )}
              
              <Link to="/events" style={styles.link}>Events</Link>
              
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.linkButton}>Register</Link>
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
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem'
  },
  linkButton: {
    color: '#2563eb',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  },
  logoutButton: {
    color: '#2563eb',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default Header;