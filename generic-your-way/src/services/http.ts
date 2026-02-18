import axios from "axios";

const API_ROOT =
import.meta.env.VITE_API_ROOT || "http://localhost:8181/api";

export const api = axios.create({
  baseURL: API_ROOT,
});


export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

const saved = localStorage.getItem("token");
if (saved) {
  api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
}
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(err);
  }
);