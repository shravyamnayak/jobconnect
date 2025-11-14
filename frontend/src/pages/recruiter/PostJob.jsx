import React, { useState } from "react";
import api from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    employmentType: "FULL_TIME"
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/api/recruiter/jobs", form);
      alert("Job posted");
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Post a Job</h2>
      <form onSubmit={submit} style={{ maxWidth: 700, display: "grid", gap: 12 }}>
        <input name="title" value={form.title} onChange={onChange} placeholder="Job title" required />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Job description" rows={6} required />
        <input name="location" value={form.location} onChange={onChange} placeholder="Location" />
        <input name="salary" value={form.salary} onChange={onChange} placeholder="Salary" />
        <select name="employmentType" value={form.employmentType} onChange={onChange}>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        <div>
          <button type="submit" disabled={saving} style={{ padding: "8px 12px" }}>
            {saving ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
