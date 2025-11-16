import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div>
            <h3 style={styles.title}>JobConnect</h3>
            <p style={styles.description}>Your Career Partner</p>
          </div>
          <div>
            <p style={styles.text}>© 2024 JobConnect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    marginTop: 'auto',
    padding: '2rem 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem'
  },
  description: {
    margin: 0,
    color: '#9ca3af'
  },
  text: {
    margin: 0,
    color: '#9ca3af'
  }
};

export default Footer;