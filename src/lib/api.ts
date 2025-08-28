import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", error);

    // Handle CORS errors
    if (error.code === "ERR_NETWORK" || error.message.includes("CORS")) {
      console.error("🚫 CORS Error detected. Check server configuration.");
    }

    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - clearing token and redirecting to login");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
