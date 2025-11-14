import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: false,
});

api.interceptors.request.use((cfg) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const auth = JSON.parse(raw);
      if (auth?.token) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (e) {}
  }
  return cfg;
});

export default api;
