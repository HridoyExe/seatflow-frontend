import { useState, useEffect } from "react";
import apiClient, { BASE_URL } from "../services/apiClient";
import authApiClient from "../services/authApiClient";

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authTokens");
    const storedUser = localStorage.getItem("seatflow_user");
    try {
      if (token && storedUser) {
        return { ...JSON.parse(storedUser), token: JSON.parse(token) };
      }
      return token ? { token: JSON.parse(token) } : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const formatUser = (userData) => {
    if (userData.profile_image && userData.profile_image.startsWith('/')) {
      userData.profile_image = `${BASE_URL}${userData.profile_image}`;
    }
    return userData;
  };

  const getErrorMessage = (error, defaultMsg) => {
    if (error.response?.data) {
      if (typeof error.response.data === 'object') {
        return Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ');
      }
      return error.response.data;
    }
    return defaultMsg;
  };

  const fetchMe = async () => {
    try {
      setLoading(true);
      const response = await authApiClient.get("/auth/users/me/");
      const userData = formatUser(response.data);

      localStorage.setItem("seatflow_user", JSON.stringify(userData));
      setUser(prev => ({ ...prev, ...userData }));

      setLoading(false);
      return { success: true, data: userData };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Failed to fetch user data") };
    }
  };

  const login = async ({ identifier, password }) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const isEmail = identifier.includes("@");
      const payload = isEmail ? { email: identifier, password } : { phone: identifier, password };

      const response = await apiClient.post("/auth/jwt/create/", payload);
      const data = response.data;

      if (data.is_verified === false) {
        setLoading(false);
        return { success: false, otpPending: true, email: identifier };
      }

      localStorage.setItem("authTokens", JSON.stringify(data));
      setUser({ token: data });

      await fetchMe();

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.detail || "Login failed" };
    }
  };

  const registerUser = async (payload) => {
    try {
      setLoading(true);
      const config = {};

      if (!(payload instanceof FormData)) {
        config.headers = { 'Content-Type': 'application/json' };
      }

      const response = await apiClient.post("/auth/register/", payload, config);
      const data = response.data;
      setLoading(false);

      if (data.is_verified === false || data.otp_required) {
        const email = payload instanceof FormData ? payload.get('email') : payload.email;
        return { success: true, otpPending: true, email: email };
      }

      return { success: true, data };
    } catch (error) {
      setLoading(false);
      const msg = getErrorMessage(error, "Registration failed");
      return { success: false, message: msg };
    }
  };

  const updateMe = async (formData) => {
    try {
      setLoading(true);
      const config = {};
      if (!(formData instanceof FormData)) {
        config.headers = { 'Content-Type': 'application/json' };
      }

      const response = await authApiClient.patch("/auth/users/me/", formData, config);
      const updatedData = formatUser(response.data);

      localStorage.setItem("seatflow_user", JSON.stringify(updatedData));
      setUser(prev => ({ ...prev, ...updatedData }));

      setLoading(false);
      return { success: true, data: updatedData };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Update failed") };
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("seatflow_user");
    setUser(null);
  };

  const sendOTP = async (email) => {
    try {
      setLoading(true);
      await apiClient.post("/auth/send-otp/", { email });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "OTP send failed") };
    }
  };

  const verifyOTP = async (email, code) => {
    try {
      setLoading(true);
      await apiClient.post("/auth/verify-otp/", { email, code });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Verification failed") };
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await apiClient.post("/auth/users/reset_password/", { email });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Reset link failed") };
    }
  };

  const resetPasswordConfirm = async (payload) => {
    try {
      setLoading(true);
      await apiClient.post("/auth/users/reset_password_confirm/", payload);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Password reset failed") };
    }
  };

  const setPassword = async (new_password, current_password) => {
    try {
      setLoading(true);
      await authApiClient.post("/auth/users/set_password/", { new_password, current_password });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: getErrorMessage(error, "Password change failed") };
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authTokens") && !user?.email) {
      fetchMe();
    }
  }, []);

  return {
    user,
    isAdmin: user?.is_staff || user?.is_superuser || user?.role === 'ADMIN' || false,
    login,
    logout,
    registerUser,
    sendOTP,
    verifyOTP,
    fetchMe,
    updateMe,
    resetPassword,
    resetPasswordConfirm,
    setPassword,
    loading,
    errorMsg
  };
};

export default useAuth;