import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Seeker Dashboard</h1>
      <p>Welcome to your dashboard.</p>

      <Link to="/profile">Edit Profile</Link>
    </div>
  );
}
