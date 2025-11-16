import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/jobs/active');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.get(`/jobs/search?keyword=${searchKeyword}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading jobs...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Find Your Dream Job</h1>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search jobs by title, company, or location..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
        </div>

        <p style={styles.resultCount}>{jobs.length} jobs found</p>

        <div style={styles.jobList}>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <div>
                    <h2 style={styles.jobTitle}>{job.title}</h2>
                    <p style={styles.jobCompany}>{job.company}</p>
                  </div>
                </div>

                <div style={styles.jobDetails}>
                  <span style={styles.jobDetail}>📍 {job.location}</span>
                  <span style={styles.jobDetail}>💼 {job.jobType}</span>
                  {job.experienceLevel && (
                    <span style={styles.jobDetail}>📊 {job.experienceLevel}</span>
                  )}
                  {job.salary && (
                    <span style={styles.jobDetail}>💰 {job.salary}</span>
                  )}
                </div>

                {job.skills && (
                  <div style={styles.skillsSection}>
                    <strong>Required Skills:</strong> {job.skills}
                  </div>
                )}

                <p style={styles.jobDescription}>
                  {job.description.length > 200 
                    ? `${job.description.substring(0, 200)}...` 
                    : job.description}
                </p>

                <div style={styles.jobFooter}>
                  <span style={styles.postedDate}>
                    Posted on {format(new Date(job.createdAt), 'PP')}
                  </span>
                  {job.deadline && (
                    <span style={styles.deadline}>
                      Apply by {format(new Date(job.deadline), 'PP')}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>No jobs found. Try adjusting your search criteria.</p>
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
    fontSize: '1.25rem'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  searchForm: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '600px'
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none'
  },
  searchButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  resultCount: {
    color: '#6b7280',
    marginBottom: '1rem',
    fontSize: '0.875rem'
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
    marginBottom: '1rem'
  },
  jobTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  jobCompany: {
    fontSize: '1.125rem',
    color: '#6b7280'
  },
  jobDetails: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  },
  jobDetail: {
    fontSize: '0.875rem',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  skillsSection: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem'
  },
  jobDescription: {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  jobFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  postedDate: {
    color: '#6b7280'
  },
  deadline: {
    color: '#dc2626',
    fontWeight: '500'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

export default JobList;