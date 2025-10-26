import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"https://modumart-api.onrender.com/api",
});

// ✅ Automatically attach token for both Admin and User safely
axiosInstance.interceptors.request.use((config) => {
  // Retrieve tokens
  const adminInfo = localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null;

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  // 🚫 Prevent mixing tokens between admin & user
  if (config.url.includes("/admin") && adminInfo?.token) {
    config.headers.Authorization = `Bearer ${adminInfo.token}`;
  } else if (!config.url.includes("/admin") && userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default axiosInstance;
