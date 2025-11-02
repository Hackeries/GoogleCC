import axios from "axios";
import { useStore } from "@/store/store";
import { ENV } from "./get-env";
import type { CustomError } from "@/types/custom-error.type";

// ✅ Base API URL from environment (.env file)
const baseURL = ENV.VITE_API_BASE_URL || "http://localhost:8000/api";

// ✅ Shared Axios options
const options = {
  baseURL,
  withCredentials: true, // allow sending cookies (important for Supabase auth)
  timeout: 15000,
};

// ===============================================
// 🔐 AUTHENTICATED REQUESTS (requires JWT)
// ===============================================
export const API = axios.create(options);

API.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error.response;

    // 🧠 Handle no response (network or timeout)
    if (!response) {
      console.error("Network error or no response from server");
      return Promise.reject({
        message: "Network error. Please check your connection.",
        errorCode: "NETWORK_ERROR",
      });
    }

    const { data, status } = response;

    // 🚪 Handle expired or invalid JWT
    if (status === 401 || data?.message === "Unauthorized") {
      const store = useStore.getState();
      store.clearUser?.();
      store.clearAccessToken?.();
      store.clearExpiresAt?.();
      window.location.href = "/";
      return;
    }

    const customError: CustomError = {
      message: data?.message || "Something went wrong",
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
      ...error,
    };

    return Promise.reject(customError);
  }
);

// ===============================================
// 🌐 PUBLIC REQUESTS (no token needed)
// ===============================================
export const PublicAPI = axios.create(options);

PublicAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    if (!response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        errorCode: "NETWORK_ERROR",
      });
    }

    const { data } = response;
    const customError: CustomError = {
      message: data?.message || "Something went wrong",
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
      ...error,
    };

    return Promise.reject(customError);
  }
);

console.log("✅ API initialized with baseURL:", baseURL);