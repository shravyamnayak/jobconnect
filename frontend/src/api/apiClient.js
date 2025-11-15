import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // <-- this is the only correct base URL
  withCredentials: false,
});

// Attach JWT token automatically
api.interceptors.request.use((cfg) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const auth = JSON.parse(raw);
      if (auth?.token) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (e) {
      console.error("Invalid auth token in local storage");
    }
  }
  return cfg;
});

export default api;
