import axios from "axios";
import { BASE_URL } from "./apiClient";

const authApiClient = axios.create({
  baseURL: BASE_URL

});

authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      config.headers.Authorization = `JWT ${JSON.parse(token)?.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApiClient;
