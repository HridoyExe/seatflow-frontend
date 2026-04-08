import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { apiEndpoints } from "../api/endpoints";
import toast from "react-hot-toast";

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (paymentData) => {
      const { data } = await apiClient.post(apiEndpoints.payment.initiate, paymentData);
      return data;
    },
    onSuccess: (data) => {
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    },
  });
};
