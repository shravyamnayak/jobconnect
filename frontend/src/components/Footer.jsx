import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}`);
      setEmail("");
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand / Logo Section */}
        <div style={styles.brandSection}>
          <h3 style={styles.brand}>JobConnect</h3>
          <p style={styles.desc}>
            Your trusted career companion for internships, jobs, events, and career growth.
          </p>
          
          {/* Newsletter Signup */}
          <div style={styles.newsletter}>
            <h4 style={styles.newsletterTitle}>Stay Updated</h4>
            <p style={styles.newsletterDesc}>Subscribe to our newsletter for the latest opportunities</p>
            <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.newsletterInput}
                required
              />
              <button type="submit" style={styles.newsletterBtn}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Job Seekers */}
        <div>
          <h4 style={styles.title}>For Job Seekers</h4>
          {["Browse Jobs", "Career Tips", "Resume Builder", "Interview Preparation", "Skill Assessments"].map((item, idx) => (
            <p
              key={idx}
              style={{
                ...styles.link,
                ...(hoveredLink === `seeker-${idx}` ? styles.linkHover : {})
              }}
              onMouseEnter={() => setHoveredLink(`seeker-${idx}`)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Employers */}
        <div>
          <h4 style={styles.title}>For Employers</h4>
          {["Post Jobs", "Find Talent", "Company Dashboard", "Hiring Insights", "Applicant Tracking"].map((item, idx) => (
            <p
              key={idx}
              style={{
                ...styles.link,
                ...(hoveredLink === `employer-${idx}` ? styles.linkHover : {})
              }}
              onMouseEnter={() => setHoveredLink(`employer-${idx}`)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4 style={styles.title}>Company</h4>
          {["About Us", "Contact", "Privacy Policy", "Terms & Conditions", "Support"].map((item, idx) => (
            <p
              key={idx}
              style={{
                ...styles.link,
                ...(hoveredLink === `company-${idx}` ? styles.linkHover : {})
              }}
              onMouseEnter={() => setHoveredLink(`company-${idx}`)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider}></div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <p style={styles.copy}>
          © {new Date().getFullYear()} JobConnect. All rights reserved.
        </p>
        <div style={styles.bottomLinks}>
          <span style={styles.bottomLink}>Privacy</span>
          <span style={styles.separator}>|</span>
          <span style={styles.bottomLink}>Terms</span>
          <span style={styles.separator}>|</span>
          <span style={styles.bottomLink}>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    padding: "4rem 2rem 2rem",
    marginTop: "2rem",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "3rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  brandSection: {
    paddingRight: "2rem",
  },
  brand: {
    fontSize: "1.75rem",
    margin: "0 0 1rem 0",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  desc: {
    color: "#94a3b8",
    marginTop: "0.5rem",
    lineHeight: "1.6",
    fontSize: "0.95rem",
  },
  newsletter: {
    marginTop: "2rem",
  },
  newsletterTitle: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  newsletterDesc: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    marginBottom: "1rem",
  },
  newsletterForm: {
    display: "flex",
    gap: "0.5rem",
  },
  newsletterInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  newsletterBtn: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
  },
  title: {
    fontSize: "1rem",
    marginBottom: "1rem",
    fontWeight: "600",
    color: "#e2e8f0",
  },
  link: {
    color: "#94a3b8",
    marginTop: "0.75rem",
    cursor: "pointer",
    transition: "color 0.2s",
    fontSize: "0.875rem",
  },
  linkHover: {
    color: "#e2e8f0",
  },
  divider: {
    height: "1px",
    backgroundColor: "#1e293b",
    margin: "3rem auto",
    maxWidth: "1200px",
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copy: {
    color: "#64748b",
    fontSize: "0.875rem",
    margin: 0,
  },
  bottomLinks: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  bottomLink: {
    color: "#64748b",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  separator: {
    color: "#475569",
    userSelect: "none",
  },
};