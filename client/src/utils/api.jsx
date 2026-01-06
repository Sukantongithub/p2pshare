import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) =>
    api.post("/auth/register", { username, email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const fileAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getFiles: () => api.get("/files"),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
  downloadFileByCode: (code) =>
    api.get(`/files/download/${code}`, { responseType: "blob" }),
  getFileInfoByCode: (code) => api.get(`/files/info/${code}`),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (username) => api.put("/user/profile", { username }),
};

export const subscriptionAPI = {
  getPlans: () => api.get("/subscription/plans"),
  getCurrentSubscription: () => api.get("/subscription/current"),
  upgradePlan: (planName) => api.post("/subscription/upgrade", { plan: planName }),
  cancelSubscription: () => api.post("/subscription/cancel"),
};

export default api;
