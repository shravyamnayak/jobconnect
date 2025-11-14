import { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/seeker/profile").then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  const handleUpdate = async () => {
    await api.put("/seeker/profile", profile);
    alert("Profile updated!");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Edit Profile</h1>

      <input
        type="text"
        value={profile.phone || ""}
        placeholder="Phone"
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
      /><br /><br />

      <input
        type="text"
        value={profile.headline || ""}
        placeholder="Headline"
        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
      /><br /><br />

      <button onClick={handleUpdate}>Save</button>
    </div>
  );
}
