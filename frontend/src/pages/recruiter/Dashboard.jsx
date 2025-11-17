import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      console.log('Fetching jobs for user:', user);
      
      // Use the new /my-jobs endpoint that uses the JWT token
      const response = await apiClient.get('/jobs/my-jobs');
      
      console.log('Jobs fetched:', response.data);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiClient.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => job.id !== jobId));
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job: ' + (error.response?.data || 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your jobs...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {showSuccess && (
          <div style={styles.successBanner}>
            ✓ Job posted successfully!
          </div>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>Recruiter Dashboard</h1>
          <Link to="/recruiter/post-job" style={styles.postButton}>
            + Post New Job
          </Link>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Jobs Posted</h3>
            <p style={styles.statValue}>{jobs.length}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Active Jobs</h3>
            <p style={styles.statValue}>
              {jobs.filter(job => job.status === 'ACTIVE').length}
            </p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Job Postings</h2>
          
          {jobs.length > 0 ? (
            <div style={styles.jobList}>
              {jobs.map(job => (
                <div key={job.id} style={styles.jobCard}>
                  <div style={styles.jobHeader}>
                    <div>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <p style={styles.jobCompany}>{job.company}</p>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: job.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                      color: job.status === 'ACTIVE' ? '#065f46' : '#dc2626'
                    }}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div style={styles.jobDetails}>
                    <span style={styles.jobDetail}>📍 {job.location}</span>
                    <span style={styles.jobDetail}>💼 {job.jobType}</span>
                    {job.salary && (
                      <span style={styles.jobDetail}>💰 {job.salary}</span>
                    )}
                  </div>
                  
                  <p style={styles.jobDescription}>
                    {job.description.length > 150 
                      ? job.description.substring(0, 150) + '...'
                      : job.description
                    }
                  </p>
                  
                  <div style={styles.jobFooter}>
                    <span style={styles.jobDate}>
                      Posted: {format(new Date(job.createdAt), 'PP')}
                    </span>
                    <div style={styles.jobActions}>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>You haven't posted any jobs yet.</p>
              <Link to="/recruiter/post-job" style={styles.link}>
                Post your first job →
              </Link>
            </div>
          )}
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
    fontSize: '1.25rem',
    color: '#6b7280'
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: '500',
    border: '1px solid #6ee7b7'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  postButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  stats: {
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
    marginBottom: '0.5rem',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb',
    margin: 0
  },
  section: {
    marginTop: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1f2937'
  },
  jobList: {
    display: 'grid',
    gap: '1rem'
  },
  jobCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.2s'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem'
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    color: '#1f2937',
    margin: '0 0 0.25rem 0'
  },
  jobCompany: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  jobDetails: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  jobDetail: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  jobDescription: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },
  jobFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  jobDate: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  jobActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '1rem',
    fontSize: '1rem'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem'
  }
};

export default RecruiterDashboard;