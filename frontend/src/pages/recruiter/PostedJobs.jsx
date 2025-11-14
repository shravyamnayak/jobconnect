import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { Link } from "react-router-dom";

export default function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/recruiter/jobs");
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/api/recruiter/jobs/${id}`);
      setJobs((j) => j.filter((x) => x.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Posted Jobs</h2>
      <Link to="/recruiter/post-job"><button style={{ marginBottom: 12 }}>Post new job</button></Link>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: "grid", gap: 12 }}>
          {jobs.length === 0 && <p>No jobs posted yet.</p>}
          {jobs.map((job) => (
            <div key={job.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <h3>{job.title}</h3>
              <p>{job.location} • {job.employmentType}</p>
              <p>{job.description?.slice(0, 200)}{job.description?.length > 200 ? "…" : ""}</p>
              <div style={{ marginTop: 8 }}>
                <Link to={`/recruiter/jobs/${job.id}/edit`}><button style={{ marginRight: 8 }}>Edit</button></Link>
                <button onClick={() => remove(job.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
