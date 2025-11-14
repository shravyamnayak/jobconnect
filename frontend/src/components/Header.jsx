import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";


export default function Header() {
  const { auth, logout, hasRole } = useAuth();
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>JobConnect</Link>
      </div>
      <nav style={styles.nav}>
        {auth ? (
          <>
            {hasRole("RECRUITER") && <Link to="/recruiter" style={styles.link}>Recruiter</Link>}
            {hasRole("JOB_SEEKER") && <Link to="/dashboard" style={styles.link}>Seeker</Link>}
            <button onClick={doLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #eee", alignItems: "center" },
  left: { display: "flex", alignItems: "center" },
  brand: { fontWeight: 700, marginRight: 12, textDecoration: "none", color: "#111" },
  nav: { display: "flex", gap: 12, alignItems: "center" },
  link: { textDecoration: "none", color: "#333" },
  btn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" },
};
