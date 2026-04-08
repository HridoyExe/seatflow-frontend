import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { apiEndpoints } from "../api/endpoints";
import toast from "react-hot-toast";

export const useMenuItems = (params = {}) => {
  return useQuery({
    queryKey: ["menuItems", params],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.menu.items, { params });
      return data;
    },
  });
};

export const useItemDetails = (id) => {
  return useQuery({
    queryKey: ["itemDetails", id],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.menu.itemDetails(id));
      return data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.menu.categories);
      return data;
    },
  });
};

export const usePostReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemPk, reviewData }) => {
      const { data } = await apiClient.post(apiEndpoints.menu.itemReviews(itemPk), reviewData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itemReviews", variables.itemPk] });
      toast.success("Review posted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to post review");
    },
  });
};

export const useItemReviews = (itemPk) => {
  return useQuery({
    queryKey: ["itemReviews", itemPk],
    queryFn: async () => {
      const { data } = await apiClient.get(apiEndpoints.menu.itemReviews(itemPk));
      return data;
    },
    enabled: !!itemPk,
  });
};
