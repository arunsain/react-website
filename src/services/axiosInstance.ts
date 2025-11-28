import axios, { AxiosError } from "axios";
import { store } from "../store/store"; // if you have a centralized store
import { logout } from "../features/userSlice";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change to your API base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =============================
// 🔹 REQUEST INTERCEPTOR
// =============================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// 🔹 RESPONSE INTERCEPTOR
// =============================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle known error types
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.error("Bad Request:", error.response.data);
          break;
        case 401:
          console.warn("Unauthorized! Logging out...");
          localStorage.removeItem("token");
          if (store) store.dispatch(logout());
          break;
        case 403:
          console.error("Forbidden: Access denied.");
          break;
        case 404:
          console.error("Not Found:", error.response.data);
          break;
        case 422:
          console.warn("Validation Error:", error.response.data);
          // You can customize how you show validation messages globally
          break;
        case 500:
          console.error("Server Error:", error.response.data);
          break;
        default:
          console.error("Unexpected Error:", error.response.data);
          break;
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    // Return a standard error object for easy handling
    return Promise.reject(
      error.response?.data || { message: "An unexpected error occurred" }
    );
  }
);

export default axiosInstance;
