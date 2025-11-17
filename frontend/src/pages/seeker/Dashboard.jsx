import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';

const SeekerDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, events: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Debug: Check if we have auth
      console.log('Auth state:', auth);
      console.log('Token exists:', !!auth?.token);
      
      // Fetch jobs
      console.log('Fetching jobs...');
      const jobsRes = await apiClient.get('/jobs/active');
      console.log('Jobs fetched successfully:', jobsRes.data.length);
      
      // Fetch events
      let eventsData = [];
      try {
        console.log('Fetching events...');
        const eventsRes = await apiClient.get('/events/upcoming');
        eventsData = eventsRes.data;
        console.log('Events fetched successfully:', eventsData.length);
      } catch (eventError) {
        console.log('Could not fetch events:', eventError.response?.status, eventError.message);
        // Events might require auth or not exist yet
      }

      setStats({
        jobs: jobsRes.data.length,
        events: eventsData.length
      });
      setRecentJobs(jobsRes.data.slice(0, 5));
      setUpcomingEvents(eventsData.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorCard}>
            <h2 style={styles.errorTitle}>⚠️ Error</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button onClick={fetchDashboardData} style={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Job Seeker Dashboard</h1>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Active Jobs</h3>
            <p style={styles.statValue}>{stats.jobs}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Upcoming Events</h3>
            <p style={styles.statValue}>{stats.events}</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Job Postings</h2>
            <Link to="/jobs" style={styles.link}>View All</Link>
          </div>
          <div style={styles.jobList}>
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <div key={job.id} style={styles.jobCard}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobCompany}>{job.company}</p>
                  <div style={styles.jobDetails}>
                    <span style={styles.jobDetail}>📍 {job.location}</span>
                    <span style={styles.jobDetail}>💼 {job.jobType}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No jobs available</p>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Upcoming Events</h2>
            <Link to="/events" style={styles.link}>View All</Link>
          </div>
          <div style={styles.eventList}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} style={styles.eventCard}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventType}>{event.eventType}</p>
                  <p style={styles.eventDate}>
                    📅 {format(new Date(event.eventDate), 'PPpp')}
                  </p>
                </div>
              ))
            ) : (
              <p>No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f3f4f6',
    minHeight: 'calc(100vh - 200px)',
    padding: '2rem 0'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '1.25rem'
  },
  errorCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '2rem auto'
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '1rem'
  },
  errorMessage: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '1.5rem'
  },
  retryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#1f2937'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  statTitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  },
  jobList: {
    display: 'grid',
    gap: '1rem'
  },
  jobCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  jobCompany: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '0.75rem'
  },
  jobDetails: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  jobDetail: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  eventList: {
    display: 'grid',
    gap: '1rem'
  },
  eventCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  eventType: {
    fontSize: '0.875rem',
    color: '#2563eb',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  eventDate: {
    fontSize: '0.875rem',
    color: '#6b7280'
  }
};

export default SeekerDashboard;