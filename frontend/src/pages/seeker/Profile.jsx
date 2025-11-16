import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    skills: '',
    experience: '',
    education: '',
    resumeUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get(`/users/${user.id}`);
      setFormData({
        fullName: response.data.fullName || '',
        phone: response.data.phone || '',
        skills: response.data.skills || '',
        experience: response.data.experience || '',
        education: response.data.education || '',
        resumeUrl: response.data.resumeUrl || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await apiClient.put(`/users/${user.id}`, formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>My Profile</h1>

        {message && (
          <div style={message.includes('success') ? styles.success : styles.error}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="e.g., JavaScript, React, Node.js"
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Experience</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Describe your work experience"
              rows="4"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Education</label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Your educational background"
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Resume URL</label>
            <input
              type="url"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://..."
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#1f2937'
  },
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default Profile;