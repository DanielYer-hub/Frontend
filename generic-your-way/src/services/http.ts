import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_USERS_API, 
  baseURL: import.meta.env.VITE_API_ROOT ,
});

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
    delete api.defaults.headers.common["x-auth-token"];
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
  res => res,
  err => {
    if (err.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(err);
  }
);