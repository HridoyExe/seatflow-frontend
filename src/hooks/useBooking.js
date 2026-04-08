import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { apiEndpoints } from "../api/endpoints";
import toast from "react-hot-toast";

export const useSeats = (params = {}) => {
  return useQuery({
    queryKey: ["seats", params],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.booking.seats, { params });
      return data;
    },
  });
};

export const useBookingHistory = () => {
  return useQuery({
    queryKey: ["bookingHistory"],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.booking.userHistory);
      return data;
    },
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.booking.bookings);
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await apiClient.post(apiEndpoints.booking.bookings, bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
      toast.success("Booking successful!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await apiClient.post(apiEndpoints.booking.bookingDetails(id) + 'cancel/');
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
      queryClient.invalidateQueries({ queryKey: ["bookingDetails", id] });
      toast.success("Booking cancelled successfully.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    },
  });
};

export const useBookingDetails = (id) => {
  return useQuery({
    queryKey: ["bookingDetails", id],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.booking.bookingDetails(id));
      return data;
    },
    enabled: !!id,
  });
};

export const useOrderItems = (bookingId) => {
  return useQuery({
    queryKey: ["orderItems", bookingId],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.booking.orderItems, {
        params: { booking: bookingId }
      });
      return data;
    },
    enabled: !!bookingId,
  });
};
