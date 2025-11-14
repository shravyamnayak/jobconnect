import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";

export default function RecruiterDashboard() {
  const [summary, setSummary] = useState({ jobsCount: 0, applicantsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Example: fetch minimal stats (implement endpoint on backend)
        const resp = await api.get("/api/recruiter/summary").catch(() => null);
        if (!mounted) return;
        if (resp?.data) setSummary(resp.data);
        else {
          // fallback: try jobs count
          const j = await api.get("/api/recruiter/jobs").catch(() => ({ data: [] }));
          if (!mounted) return;
          setSummary({ jobsCount: j.data?.length || 0, applicantsCount: 0 });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Recruiter Dashboard</h2>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: "flex", gap: 18 }}>
          <div style={cardStyle}>
            <h3>{summary.jobsCount}</h3>
            <p>Jobs posted</p>
            <Link to="/recruiter/jobs">View jobs</Link>
          </div>
          <div style={cardStyle}>
            <h3>{summary.applicantsCount}</h3>
            <p>Applicants</p>
          </div>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to="/recruiter/post-job"><button style={primaryBtn}>Post a job</button></Link>
      </div>
    </div>
  );
}

const cardStyle = { border: "1px solid #ddd", padding: 16, borderRadius: 8, width: 200 };
const primaryBtn = { background: "#2563eb", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" };
