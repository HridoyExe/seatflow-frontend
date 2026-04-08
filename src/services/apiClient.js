import axios from "axios";

export const BASE_URL = "https://seatflow-backend-xnoc.vercel.app";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const tokenData = localStorage.getItem("authTokens");
    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens?.access) {
          config.headers.Authorization = `JWT ${tokens.access}`;
        }
      } catch (error) {
        console.error("Auth token parse error:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("seatflow_user");
      localStorage.removeItem("authTokens");
    }

    if (status === 500) {
      console.error("Server Error");
    }

    return Promise.reject(error);
  }
);

export default apiClient;