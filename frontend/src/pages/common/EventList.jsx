import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const EventList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'INTERVIEW',
    eventDate: '',
    location: '',
    link: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/events/my-events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/events', formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        eventType: 'INTERVIEW',
        eventDate: '',
        location: '',
        link: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleComplete = async (eventId) => {
    try {
      await apiClient.put(`/events/${eventId}/complete`);
      fetchEvents();
    } catch (error) {
      console.error('Error completing event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiClient.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading events...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Events & Reminders</h1>
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>Create New Event</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Event Type *</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="INTERVIEW">Interview</option>
                <option value="WEBINAR">Webinar</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="CAMPUS_DRIVE">Campus Drive</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date & Time *</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={styles.input}
                placeholder="Physical location or 'Online'"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Meeting Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                style={styles.input}
                placeholder="https://..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                rows="3"
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Create Event
            </button>
          </form>
        )}

        <div style={styles.eventList}>
          {events.length > 0 ? (
            events.map(event => (
              <div 
                key={event.id} 
                style={{
                  ...styles.eventCard,
                  opacity: event.completed ? 0.6 : 1
                }}
              >
                <div style={styles.eventHeader}>
                  <div>
                    <h3 style={styles.eventTitle}>{event.title}</h3>
                    <span style={styles.eventType}>{event.eventType}</span>
                  </div>
                  {event.completed && (
                    <span style={styles.completedBadge}>✓ Completed</span>
                  )}
                </div>

                <p style={styles.eventDate}>
                  📅 {format(new Date(event.eventDate), 'PPpp')}
                </p>

                {event.location && (
                  <p style={styles.eventLocation}>📍 {event.location}</p>
                )}

                {event.link && (
                  <p style={styles.eventLink}>
                    🔗 <a href={event.link} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </p>
                )}

                {event.description && (
                  <p style={styles.eventDescription}>{event.description}</p>
                )}

                {event.jobTitle && (
                  <p style={styles.eventJob}>Related to: {event.jobTitle}</p>
                )}

                <div style={styles.eventActions}>
                  {!event.completed && (
                    <button
                      onClick={() => handleComplete(event.id)}
                      style={styles.completeButton}
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(event.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p>No events scheduled yet.</p>
              <p>Create your first event to keep track of interviews and career events!</p>
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
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937'
  },
  formGroup: {
    marginBottom: '1rem'
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
  submitButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '1rem'
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
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem'
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937'
  },
  eventType: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  completedBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  eventDate: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.5rem'
  },
  eventLocation: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  eventLink: {
    fontSize: '0.875rem',
    marginBottom: '0.5rem'
  },
  eventDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '1rem',
    lineHeight: '1.5'
  },
  eventJob: {
    fontSize: '0.875rem',
    color: '#2563eb',
    fontWeight: '500',
    marginTop: '0.5rem'
  },
  eventActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  completeButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer'
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

export default EventList;